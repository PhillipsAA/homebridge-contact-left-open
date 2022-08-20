# Homebridge-Contact-Left-Open

With this plugin, you can create any number of contact left open accessories.  When combined with a contact sensor, you can be notified when the contact sensor has been open for too long and then again once it has been closed.

## Why do you need this plugin?
The most common use of this plugin is to be notified when a contact sensor has been left open for too long.  For example, your garage door has been left open for longer than 5 minutes.  I created it to be notified if any of my doors have been left open for longer than 30 seconds or the garage door has been left open for longer than 15 minutes.

## How it works
* Config the accessory name and timeout
    * The plugin will create one switch and contact sensor for each accessory configured
* Use HomeKit automation to do the following:
    * Turn on the virtual switch when the contact sensor being monitored opens
    * Turn off the virtual switch when the contact sensor being monitored closes
* Turn on notifications for when the virtual contact sensor triggers
* That is it, you should now be notified if the contact sensor being monitored is left open too long

## Installations

If you do not use Homebridge UI or HOOBS then do the following:
* ```sudo npm install -g homebridge-contact-left-open@1.0.4```
* Create an accessory in your config.json file
* Restart homebridge

## Example config.json:
```
    "accessories": [
        {
            "accessory": "ContactLeftOpenAccessory",
            "name": "Garage Door Left Open",
            "timeout": 300
        }
    ]
```

|             Parameter             |         Description                    | Required |   type   |
| --------------------------------  | -------------------------------------- |:--------:|:--------:|
| `accessory`                       | always `"ContactLeftOpenAccessory"`    |     ✓    |  String  |
| `name`                            | Name for your accessory                |     ✓    |  String  |
| `timeout`                         |  Timeout in seconds                      |     ✓    |  Integer |
