let PumpState = 0
let LightState = 0
let prev_millis = 0
makerbit.connectLcd(39)
makerbit.clearLcd1602()
esp8266.init(SerialPin.P16, SerialPin.P15, BaudRate.BaudRate115200)
esp8266.connectWiFi("HongLoan lau 2.1", "28042003")
if (esp8266.isWifiConnected()) {
    music.play(music.builtinPlayableSoundEffect(soundExpression.happy), music.PlaybackMode.UntilDone)
    basic.showLeds(`
        . . . . #
        . . . # .
        # . # . .
        . # . . .
        . . . . .
        `)
    makerbit.showStringOnLcd1602("Connected!", makerbit.position1602(LcdPosition1602.Pos1), 16, TextOption.AlignCenter)
} else {
    basic.showLeds(`
        # . . . #
        . # . # .
        . . # . .
        . # . # .
        # . . . #
        `)
    makerbit.showStringOnLcd1602("Can't connect to wifi", makerbit.position1602(LcdPosition1602.Pos1), 16)
}
let BlynkToken = "3V1cD0r6-L2LLop4EC2M4jvo2yhV6HCw"
basic.forever(function () {
    if (control.millis() - prev_millis >= 5000) {
        prev_millis = control.millis()
        basic.clearScreen()
        esp8266.writeBlynk(BlynkToken, "V1", convertToText(input.soundLevel()))
        esp8266.writeBlynk(BlynkToken, "V0", convertToText(input.temperature()))
        if (input.temperature() > 28) {
            esp8266.writeBlynk(BlynkToken, "V2", "Not enough moisture")
            esp8266.writeBlynk(BlynkToken, "V4", "ON")
        } else {
            esp8266.writeBlynk(BlynkToken, "V2", "Enough moisture")
            esp8266.writeBlynk(BlynkToken, "V4", "OFF")
        }
        if (input.soundLevel() > 30) {
            esp8266.writeBlynk(BlynkToken, "V5", "Not enough brightness")
            esp8266.writeBlynk(BlynkToken, "V3", "ON")
        } else {
            esp8266.writeBlynk(BlynkToken, "V5", "Enough brightness")
            esp8266.writeBlynk(BlynkToken, "V3", "OFF")
        }
        if (esp8266.isBlynkUpdated()) {
            basic.showIcon(IconNames.Happy)
        } else {
            basic.showIcon(IconNames.Sad)
        }
    }
})
basic.forever(function () {
    if (esp8266.isWifiConnected()) {
        makerbit.clearLcd1602()
        makerbit.showStringOnLcd1602("Wifi connected", makerbit.position1602(LcdPosition1602.Pos1), 16, TextOption.AlignCenter)
        basic.pause(3000)
    } else {
        makerbit.clearLcd1602()
        makerbit.showStringOnLcd1602("Wifi not", makerbit.position1602(LcdPosition1602.Pos1), 16, TextOption.AlignCenter)
        makerbit.showStringOnLcd1602("connected", makerbit.position1602(LcdPosition1602.Pos17), 16, TextOption.AlignCenter)
        basic.pause(3000)
    }
    if (input.temperature() > 28) {
        makerbit.clearLcd1602()
        makerbit.showStringOnLcd1602("Not enough moisture", makerbit.position1602(LcdPosition1602.Pos1), 16, TextOption.AlignCenter)
        makerbit.showStringOnLcd1602("moisture", makerbit.position1602(LcdPosition1602.Pos17), 16, TextOption.AlignCenter)
        basic.pause(3000)
        makerbit.clearLcd1602()
        makerbit.showStringOnLcd1602("-| Pump On |-", makerbit.position1602(LcdPosition1602.Pos17), 16, TextOption.AlignCenter)
        basic.pause(3000)
    } else {
        makerbit.clearLcd1602()
        makerbit.showStringOnLcd1602("Enough moisture", makerbit.position1602(LcdPosition1602.Pos1), 16, TextOption.AlignCenter)
        makerbit.showStringOnLcd1602("-| Pump Off |-", makerbit.position1602(LcdPosition1602.Pos17), 16, TextOption.AlignCenter)
        basic.pause(3000)
    }
    if (input.soundLevel() > 30) {
        makerbit.clearLcd1602()
        makerbit.showStringOnLcd1602("Not enough", makerbit.position1602(LcdPosition1602.Pos1), 16, TextOption.AlignCenter)
        makerbit.showStringOnLcd1602("brightness", makerbit.position1602(LcdPosition1602.Pos17), 16, TextOption.AlignCenter)
        basic.pause(3000)
        makerbit.clearLcd1602()
        makerbit.showStringOnLcd1602("-| Light On |-", makerbit.position1602(LcdPosition1602.Pos17), 16, TextOption.AlignCenter)
        basic.pause(3000)
    } else {
        makerbit.clearLcd1602()
        makerbit.showStringOnLcd1602("Enough brightness", makerbit.position1602(LcdPosition1602.Pos1), 16, TextOption.AlignCenter)
        makerbit.showStringOnLcd1602("-| Light Off |-", makerbit.position1602(LcdPosition1602.Pos17), 16, TextOption.AlignCenter)
        basic.pause(3000)
    }
})
// Kiểm tra điều kiện ánh sáng để quyết định bật hay tắt đèn.
// Giá trí ngưỡng ánh sáng thiết lập dựa trên độ sáng muốn bật đèn
basic.forever(function () {
    if (input.soundLevel() >= 40) {
        basic.showIcon(IconNames.Heart)
        pins.digitalWritePin(DigitalPin.P13, 1)
        LightState = 1
    } else {
        basic.showIcon(IconNames.SmallHeart)
        basic.pause(1000)
    }
})
// Kiểm tra điều kiện ánh sáng để quyết định bật hay tắt đèn.
// Giá trí ngưỡng ánh sáng thiết lập dựa trên độ sáng muốn bật đèn
basic.forever(function () {
    if (input.temperature() > 28) {
        basic.showIcon(IconNames.Heart)
        pins.digitalWritePin(DigitalPin.P14, 1)
        PumpState = 1
    } else {
        basic.pause(1000)
        basic.showIcon(IconNames.SmallHeart)
        pins.digitalWritePin(DigitalPin.P14, 0)
        PumpState = 0
    }
})
