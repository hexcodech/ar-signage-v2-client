const os = require('os');

module.exports = class UUID {
    constructor() {}
    
    getUUID() {
        const networkInterfaces = os.networkInterfaces();
        if (networkInterfaces.Ethernet)
            return networkInterfaces.Ethernet[0].mac;
        else
            return networkInterfaces[0][0].mac;
    }
}