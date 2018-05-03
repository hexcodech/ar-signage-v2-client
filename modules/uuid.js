const os = require('os');

module.exports = class UUID {
    constructor() {}
    
    getUUID() {
        const networkInterfaces = os.networkInterfaces();
        console.dir(networkInterfaces);
        if (networkInterfaces.Ethernet)
            return networkInterfaces.Ethernet[0].mac;
        else if (networkInterfaces.eth0)
            return networkInterfaces.eth0[0].mac;
        else if (networkInterfaces.en0)
            return networkInterfaces.en0[0].mac;
        else
            return networkInterfaces[0][0].mac;
    }
}