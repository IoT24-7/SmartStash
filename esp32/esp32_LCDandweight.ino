#include <Wire.h>
#include <LiquidCrystal_I2C.h>      // for LCD Display 
#include "HX711.h"                  // for load cell
#include "time.h"
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <Arduino.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h" //Provide the token generation process info.
#include "addons/RTDBHelper.h" //Provide the RTDB payload printing info and other helper functions.

// NTP server
const char* ntpServer = "pool.ntp.org";
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP);

// HX711 module pins
const int LOADCELL_DOUT_PIN = 16;
const int LOADCELL_SCK_PIN = 4;

// LCD I2C address and dimensions
#define LCD_ADDRESS 0x27
#define LCD_COLUMNS 16
#define LCD_ROWS    2

// Initialize the HX711 instance
HX711 scale;

// Initialize the LCD object
LiquidCrystal_I2C lcd(LCD_ADDRESS, LCD_COLUMNS, LCD_ROWS);

// DEFINITIONS FOR FIREBASE
// Insert your network credentials
#define WIFI_SSID "beyatris"
#define WIFI_PASSWORD "HS130179"

// Insert Firebase project API Key
#define API_KEY "AIzaSyD3qNpR_UAi5sXHIX4Way38C-uELvnxkdk"

// Insert RTDB URLefine the RTDB URL */
#define DATABASE_URL "https://cs145-smartstash-default-rtdb.asia-southeast1.firebasedatabase.app/" 

//Define Firebase Data object
FirebaseData stream;
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
FirebaseJson json;

String devicePath = "containers/" + WiFi.macAddress();
String labelPath = "/label";
String weightPath = "/weight";
String thresholdPath = "/threshold";
String timestampPath = "/timestamp";

unsigned long sendDataPrevMillis = 0;
int count = 0;
bool signupOK = false;
int timestamp;

String label;

void setupwifi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED){
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();
}

void setupfirebase(){
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  if (Firebase.signUp(&config, &auth, "", "")){
    Serial.println("ok");
    signupOK = true;
  }
  else{
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }

  /* Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback; //see addons/TokenHelper.h
  
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  if (!Firebase.RTDB.beginStream(&stream, devicePath.c_str())) {
    Serial.printf("stream begin error, %s\n\n", stream.errorReason().c_str());
  }

  Firebase.RTDB.setStreamCallback(&stream, streamCallback, streamTimeoutCallback);
}

void streamTimeoutCallback(bool timeout) {
  if (timeout)
    Serial.println("stream timeout, resuming...\n");
  if (!stream.httpConnected())
    Serial.printf("error code: %d, reason %s\n\n", stream.httpCode(), stream.errorReason().c_str());
}

unsigned long getTime() {
  time_t now;
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    return(0);
  }
  time(&now);
  return now;
}

void streamCallback(FirebaseStream data) {
  String streamPath = String(data.dataPath());

  if (streamPath == devicePath + "/threshold") {
    Serial.println("here");
  }

  // if data returned is a float, there was a change on the threshold
  if (data.dataTypeEnum() == fb_esp_rtdb_data_type_float) {
    float threshold = data.floatData();
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Threshold updated:");
    lcd.setCursor(0, 1);
    lcd.print(threshold, 1); // displays up to one decimal 
    lcd.print(" g");
  } else if (data.dataTypeEnum() == fb_esp_rtdb_data_type_string) {
    String newLabel = data.stringData();
    label = newLabel;
  }

  delay(2000);
}

void setup() {
  Serial.begin(115200);
  configTime(0, 0, ntpServer);
  
  timeClient.begin();

  // Initialize the HX711 scale
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);

  //prev 1785
  scale.set_scale(1695.f);             // computed from HX711_Calibration sketch example

  // Initialize the LCD
  lcd.init();
  lcd.backlight();

  setupwifi();
  setupfirebase();
}

void loop() {
  scale.power_down();              // put the ADC in sleep mode
  delay(5000);                     // sometimes doesn't print if there's no delay
  scale.power_up();

  // Display the current weight on the LCD 
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Weight:");
  lcd.setCursor(0, 1);
  lcd.print(scale.get_units(), 1); // displays up to one decimal 
  lcd.print(" g");

  if (Firebase.ready() && signupOK) {
    if (millis() - sendDataPrevMillis > 5000 || sendDataPrevMillis == 0) {
      sendDataPrevMillis = millis();

      // Write the current reading on the database path testData2/container1/currentWeight
      timeClient.update();
      timestamp = getTime();
      Serial.println(timeClient.getFormattedTime());
      
      json.set(weightPath.c_str(), scale.get_units());
      json.set(timestampPath.c_str(), String(timestamp));
      Serial.printf("Set json... %s\n", Firebase.RTDB.setJSON(&fbdo, devicePath.c_str(), &json) ? "ok" : stream.errorReason().c_str());
    }
  }
}