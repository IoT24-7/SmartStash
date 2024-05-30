#include <Wire.h>
#include <LiquidCrystal_I2C.h>      // for LCD Display 
#include "HX711.h"                  // for load cell
#include "time.h"
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <Arduino.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h" //Poipuopoioip[op[]]i[][p]oop[]p[pp[]jhgghvvrovide the token generation process info.
#include "addons/RTDBHelper.h" //Provide the RTDB payload printing info and other helper functions.

// NTP server
const char* ntpServer = "time.google.com";
const long  gmtOffset_sec = 28800;
const int   daylightOffset_sec = 0;

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

// Insert your network credentials
#define WIFI_SSID "DragonsDen"
#define WIFI_PASSWORD "iotcup2024fusrodah"

// Insert Firebase project API Key
#define API_KEY "AIzaSyD3qNpR_UAi5sXHIX4Way38C-uELvnxkdk"

// Insert RTDB URL
#define DATABASE_URL "https://cs145-smartstash-default-rtdb.asia-southeast1.firebasedatabase.app/" 

// Define Firebase Data object
FirebaseData stream;
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
FirebaseJson json;

// Define Firebase RTDB paths
String devicePath = "containers/" + WiFi.macAddress();
String labelPath = devicePath + "/foodName";
String weightPath = devicePath + "/currentWeight";
String thresholdPath = devicePath + "/threshold";
String statusPath = devicePath + "/status";
String timestampPath = devicePath + "/timestamp";

unsigned long sendDataPrevMillis = 0;
int count = 0;
bool signupOK = false;
String timestamp;

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

String printLocalTime() {
  struct tm timeinfo;
  if(!getLocalTime(&timeinfo)){
    Serial.println("Failed to obtain time");
    return "Failed to obtain time";
  }
  char timeStringBuff[20]; // Allocate a buffer to hold the formatted time string
  sprintf(timeStringBuff, "%04d-%02d-%02d %02d:%02d:%02d",
                timeinfo.tm_year + 1900,
                timeinfo.tm_mon + 1,
                timeinfo.tm_mday,
                timeinfo.tm_hour,
                timeinfo.tm_min,
                timeinfo.tm_sec);
  return String(timeStringBuff);
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
}

void setup() {
  Serial.begin(115200);

  // Initialize the HX711 scale
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);

  //prev 1785
  scale.set_scale(1695.f);             // computed from HX711_Calibration sketch example

  // Initialize the LCD
  lcd.init();
  lcd.backlight();

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Connecting...");

  setupwifi();
  setupfirebase();

  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Connected!");
}

void loop() {
  scale.power_down();              // put the ADC in sleep mode
  delay(5000);
  scale.power_up();

  int weight = round(scale.get_units() - 208);

  // Display the current weight on the LCD 
  lcd.clear();
  lcd.setCursor(0, 1);
  lcd.print(weight); // displays up to one decimal 
  lcd.print(" g");

  if (Firebase.ready() && signupOK) {
    if (millis() - sendDataPrevMillis > 20000 || sendDataPrevMillis == 0) {
      sendDataPrevMillis = millis();

      timestamp = printLocalTime();
      Serial.println(weight);

      if (Firebase.RTDB.setInt(&fbdo, weightPath.c_str(), weight)) {
        Serial.println("updated weight");
      } else {
        Serial.println("failed to update weight");
      }

      if (Firebase.RTDB.setString(&fbdo, timestampPath.c_str(), timestamp)) {
        Serial.println("updated time");
      } else {
        Serial.println("failed to update time");
      }

      if (Firebase.RTDB.getString(&fbdo, labelPath)) {
        if (fbdo.dataType() == "string") {
          label = fbdo.stringData();
        }
      } else {
        Serial.println(fbdo.errorReason()); //print he error (if any)
      }
    }
  }

  lcd.setCursor(0, 0);
  lcd.print(label);
}