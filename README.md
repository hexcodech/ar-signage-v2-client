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
    Generates a unique identifier of the client