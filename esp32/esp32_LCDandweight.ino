#include <Wire.h>
#include <LiquidCrystal_I2C.h>      // for LCD Display 
#include "HX711.h"                  // for load cell

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

void setup() {
  Serial.begin(9600);
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
}