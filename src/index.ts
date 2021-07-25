import { AccessoryInformation } from 'hap-nodejs/dist/lib/definitions';
import { AccessoryConfig, AccessoryPlugin, API, CharacteristicValue, HAP, Logging, Service } from 'homebridge';

let hap: HAP;

// Initializer function called when the plugin is loaded.
export = (api: API) => {
  hap = api.hap;
  api.registerAccessory('homebridge-contact-left-open', 'ContactLeftOpenAccessory', ContactLeftOpenAccessory);
};

class ContactLeftOpenAccessory implements AccessoryPlugin {
  private readonly config: AccessoryConfig;
  private readonly log: Logging;
  private readonly api: API;

  private readonly switchService: Service;
  private readonly contactService: Service;

  private switchState = 0;
  private timeoutId!: NodeJS.Timeout;

  constructor(log: Logging, config: AccessoryConfig, api: API) {
    this.config = config;
    this.log = log;
    this.api = api;

    log.info('Loading', config.name, 'with a timeout of', config.timeout);

    this.switchService = this.createSwitch();
    this.contactService = this.createContactSensor();

    log.info('Accessory finished initializing!');
  }

  switchOnGet() {
    this.log.debug('Switch currently set to =>', this.getSwitchState());

    return this.switchState;
  }

  switchOnSet(value: CharacteristicValue) {
    this.switchState = value as number;

    this.log.debug('Switch set to =>', this.getSwitchState());

    if (this.switchState) {
      this.timeoutId = setTimeout(() => {
        this.log.debug('Door left open for too long...');

        this.setContactSensorState(true);
      }, this.config.timeout * 1000);
    } else {
      clearTimeout(this.timeoutId);
      this.setContactSensorState(false);
    }
  }

  setContactSensorState(value: boolean) {
    this.log.info('Contact sensor open =>', value);

    this.contactService.getCharacteristic(hap.Characteristic.ContactSensorState).updateValue(value);
  }

  getSwitchState(): string {
    return this.switchState ? 'ON' : 'OFF';
  }

  createSwitch(): Service {
    const service = new hap.Service.Switch(this.config.name);

    service.getCharacteristic(hap.Characteristic.On)
      .onGet(this.switchOnGet.bind(this))
      .onSet(this.switchOnSet.bind(this));

    return service;
  }

  createContactSensor(): Service {
    return new hap.Service.ContactSensor(this.config.name);
  }

  getServices(): Service[] {
    return [this.getAccessoryInformation(), this.switchService, this.contactService];
  }

  getAccessoryInformation(): AccessoryInformation {
    return new hap.Service.AccessoryInformation()
      .setCharacteristic(hap.Characteristic.Manufacturer, 'Ong Software')
      .setCharacteristic(hap.Characteristic.SerialNumber, hap.uuid.generate('ContactLeftOpenAccessory' + this.config.name))
      .setCharacteristic(hap.Characteristic.Model, 'Contact Left Open Accessory');
  }
}