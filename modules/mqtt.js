const mqtt = require('mqtt');
const ip = require('ip');
const evilscan = require('evilscan');
const uuidModule = new (require('./uuid'))();

module.exports = class MQTT {
    constructor() {
        this.mqttClient = null;
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.evilScanner = new evilscan({
                target: `${ip.mask(uuidModule.getMainNetworkInterface().address, ip.fromPrefixLen(24))}/24`,
                port: '1883',
                status: 'O',
            }, (err, scan) => {
                if (err) {
                    reject(`evilScanner error: ${err}`);
                    return;
                }

                scan.on('result', (data) => {
                    resolve(data);
                    // TODO: Connect to address found
                    // this.mqttClient = mqtt.connect(uri);
                    return;
                });

                scan.on('error', (err) => {
                    reject(`evilScanner error: ${err}`);
                    return;
                })

                scan.on('done', () => {
                    reject(`evilScanner error: No suitable mqtt server found`);
                    return;
                })

                scan.run();
            });
        });
    }
}