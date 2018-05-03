const mqtt = require('mqtt');

module.exports = class MQTT {
    constructor() {
        this.mqttClient = mqtt.connect('mqtt://192.168.178.2');
    }

    // We can probably leave all this stuff out and implement it directly using the remote functionality
    /*subscribe(topic, options) {
        this.mqttClient.subscribe(topic, options);
    }

    unsubscribe(topic) {
        this.mqttClient.unsubscribe(topic);
    }

    publish(topic, message, options) {
        this.mqttClient.publish(topic, message, options);
    }*/
}