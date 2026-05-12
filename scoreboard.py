from machine import Pin, SPI, PWM, I2C
import max7219_8digit 
import ssd1306        #oled plugin
import time           

spi = SPI(0, baudrate=10000000, polarity=1, phase=0, sck=Pin(2), mosi=Pin(3))
ss = Pin(5, Pin.OUT) 
display = max7219_8digit.Display(spi, ss)

i2c = I2C(0, scl=Pin(1), sda=Pin(0), freq=400000)
oled = ssd1306.SSD1306_I2C(128, 64, i2c) #res

#så att inget är kvar på skärmen
oled.fill(0)
oled.show()

#on or off 
home_plus  = Pin(6,  Pin.IN, Pin.PULL_UP)
home_minus = Pin(7,  Pin.IN, Pin.PULL_UP)
away_plus  = Pin(8,  Pin.IN, Pin.PULL_UP)
away_minus = Pin(9,  Pin.IN, Pin.PULL_UP)
reset_btn  = Pin(10, Pin.IN, Pin.PULL_UP)
goal_btn   = Pin(11, Pin.IN, Pin.PULL_UP)

#på 0 så att de e tyst
buzzer = PWM(Pin(16))
buzzer.duty_u16(0) 

#variabler för poeng
home_score = 0
away_score = 0

#text på skärmen
display.write_to_buffer("H-00A-00")
display.display()

while True:
    #om nedtryckt
    if home_plus.value() == 0:
        if home_score < 99: #max 99 så inte blir konstigt på skärmen
            home_score += 1
        time.sleep(0.2) 

    if home_minus.value() == 0:
        if home_score > 0:
            home_score -= 1
        time.sleep(0.2)

    if away_plus.value() == 0:
        if away_score < 99:
            away_score += 1
        time.sleep(0.2)

    if away_minus.value() == 0:
        if away_score > 0:
            away_score -= 1
        time.sleep(0.2)

    #reset nollställer både var
    if reset_btn.value() == 0:
        home_score = 0
        away_score = 0
        time.sleep(0.2)

    if goal_btn.value() == 0:
        #sätter volym 50%
        buzzer.duty_u16(30000) 
        #3 frekvenser
        for f in [600, 900, 1200]: 
            buzzer.freq(f)
            time.sleep(0.2)
        #stänger ljudet
        buzzer.duty_u16(0) 

        #fyller oled skärmed med vit
        oled.fill(1) 
        #skriver texten goal
        oled.text("GOAL!", 44, 28, 0)
        oled.show()
        time.sleep(2) 

        oled.fill(0) 
        oled.show()

    #{:02d} gör så att talet måste ha 2 siffror
    display_text = "H-{:02d}A-{:02d}".format(home_score, away_score)

    display.write_to_buffer(display_text)
    display.display()

    #förhindra krasher
    time.sleep(0.01)
