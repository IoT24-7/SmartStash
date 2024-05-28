#include <Wire.h>
#include <LiquidCrystal_I2C.h>      // for LCD Display 
#include "HX711.h"                  // for load cell

#include <Arduino.h>
#if defined(ESP32)
  #include <WiFi.h>
#elif defined(ESP8266)
  #include <ESP8266WiFi.h>
#endif
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h" //Provide the token generation process info.
#include "addons/RTDBHelper.h" //Provide the RTDB payload printing info and other helper functions.

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
#define WIFI_SSID "4studentstoo"
#define WIFI_PASSWORD "W1F14students"

// Insert Firebase project API Key
#define API_KEY "AIzaSyD3qNpR_UAi5sXHIX4Way38C-uELvnxkdk"

// Insert RTDB URLefine the RTDB URL */
#define DATABASE_URL "https://cs145-smartstash-default-rtdb.asia-southeast1.firebasedatabase.app/" 

//Define Firebase Data object
FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
int count = 0;
bool signupOK = false;


void setup() {
  Serial.begin(115200);
  Serial.println("HX711 Demo");

  // Initialize the HX711 scale
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);

  Serial.println("Before setting up the scale:");
  Serial.print("read: \t\t");
  Serial.println(scale.read());         // print a raw reading from the ADC

  Serial.print("read average: \t\t");
  Serial.println(scale.read_average(20));    

  Serial.print("get value: \t\t");
  Serial.println(scale.get_value(5));

  Serial.print("get units: \t\t");
  Serial.println(scale.get_units(5), 1);    

  //prev 1785
  scale.set_scale(1695.f);             // computed from HX711_Calibration sketch example
  scale.tare();                        // reset the scale to 0

  Serial.println("After setting up the scale:");

  Serial.print("read: \t\t");
  Serial.println(scale.read());               

  Serial.print("read average: \t\t");
  Serial.println(scale.read_average(20));     

  Serial.print("get value: \t\t");
  Serial.println(scale.get_value(5));       

  Serial.print("get units: \t\t");
  Serial.println(scale.get_units(5), 1);

  Serial.println("Readings:");

  // Initialize the LCD
  lcd.init();
  lcd.backlight();

  //Firebase Setup
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

  /* Assign the api key (required) */
  config.api_key = API_KEY;

  /* Assign the RTDB URL (required) */
  config.database_url = DATABASE_URL;

  /* Sign up */
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



void loop() {
  // print current reading and average
  Serial.print("one reading:\t");
  Serial.print(scale.get_units(), 1);
  Serial.print("\t| average:\t");
  Serial.println(scale.get_units(10), 1);

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

  //Updating firebase every interval
  if (Firebase.ready() && signupOK && (millis() - sendDataPrevMillis > 15000 || sendDataPrevMillis == 0)){
    sendDataPrevMillis = millis();
    // Write the current reading on the database path testData2/container1/currentWeight
    if (Firebase.RTDB.setFloat(&fbdo, "testData2/container1/currentWeight", scale.get_units())){
      Serial.println("PASSED");
      Serial.println("PATH: " + fbdo.dataPath());
      Serial.println("TYPE: " + fbdo.dataType());
    }
    else {
      Serial.println("FAILED");
      Serial.println("REASON: " + fbdo.errorReason());
    }
  }
}