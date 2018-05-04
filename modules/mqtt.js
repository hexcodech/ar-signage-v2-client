const mqtt = require('mqtt');

module.exports = class MQTT {
    constructor(uri) {
        this.mqttClient = mqtt.connect(uri);
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