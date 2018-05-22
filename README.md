# AR-Signage-v2-Client

## Overview
- index.js  
    Main entry point for app.  
    Starts electron window and serves files.
- /frontend-app  
    Directory that houses the Angular2 app.
- /modules  
    Directory that houses modules to be included using the remote ipc functionality of electron.  

    - uuid.js  
        - getUUID() - Generates a unique identifier of the client
        - getMainNetworkInterface() - Get main network interface from the 'os'
        node module
    - mqtt.js
        - connect() - Performs a port scan to find a mqtt server in the local 
        network and connects the mqtt.js instance to it. Returns the ip of the 
        connected server on success.
    - mediaCache.js
        - downloadAndStore(mediaId) - Downloads the media and stores it in the 
        user data directory of the client os in a folder called mediaCache.
        - getLink(mediaId) - Checks if the referenced media filed is stored in 
        the user data directory of the client and returns the file:// url to 
        it. If it fails to find the file locally it starts it's download and 
        then returns the file:// url on success.