

var DEBUG=false;


Module.register("MMM-Hostname",{
	// Default module config.
	defaults: {
        text: "Hello World!",
        size: "5"
	},

    // Override dom generator.
    // Happens at each redraw of the screen module
	getDom: function() {
        var wrapper = document.createElement("div");
        //wrapper.setAttribute"id",".headline";
        
        //this.size="10";
        if (DEBUG) {Log.log("Font Size from Config or Default: " + this.size.toString())};
        wrapper.innerHTML = '<font size="' + this.size.toString() + '">' + this.hostname + '</font>';
        if (DEBUG) {Log.log ("INNERHTML: " +wrapper.innerHTML)}; 
        //wrapper.innerHTML = '<font size="1">'+ this.hostname + '</font>';  //Was actually working with Hostname
        //wrapper.innerHTML += '<BR><font size="2">'+ this.address + '</font>';
        //wrapper.innerHTML=this.IncidentInfo;
        //this.sendSocketNotification('GET_INCIDENT_INFO',this.config);
		return wrapper;
    },
    loaded: function(callback) {
        this.finishLoading();
        Log.log(this.name + ' is loaded!');
        callback();
    },
    start: function() {
        this.hostname = "";
        this.size=this.config.size;
        Log.log(this.name + ' is started!');
        var self = this;
        setInterval(function() {
            self.updateDom(); // no speed defined, so it updates instantly.
        }, 1000); //perform every 1000 milliseconds.
        this.sendSocketNotification('GET_HOSTNAME');
    },
    getScripts: function() {
        return [
            //'script.js', // will try to load it from the vendor folder, otherwise it will load is from the module folder.
            //'moment.js', // this file is available in the vendor folder, so it doesn't need to be available in the module folder.
            //this.file('anotherfile.js'), // this file will be loaded straight from the module folder.
            //'https://code.jquery.com/jquery-2.2.3.min.js',  // this file will be loaded from the jquery servers.
        ]
    },
	getStyles: function() {
		return ["MMM-Hostname.css"];
	},
    // The System Sends three notifications when starting up, these are:
    //ALL_MODULES_STARTED - All modules are started. You can now send notifications to other modules.
    //DOM_OBJECTS_CREATED - All dom objects are created. The system is now ready to perform visual changes.
    //MODULE_DOM_CREATED - This module's dom has been fully loaded. You can now access your module's dom objects.
    notificationReceived: function(notification, payload, sender) {
        if (sender) {
            Log.log(this.name + " received a MODULE notification$$$$$: " + notification + " from sender: " + sender.name);
        } else {
            Log.log(this.name + " received a SYSTEM notification$$$$$: " + notification);
        }
    },
    // When using a node_helper, the node helper can send your module notifications. When this module is called, it has 2 arguments:
    // notification - String - The notification identifier.
    // payload - AnyType - The payload of a notification.
    // Note 1: When a node helper sends a notification, all modules of that module type receive the same notifications. 
    // Note 2: The socket connection is established as soon as the module sends its first message using sendSocketNotification.
    socketNotificationReceived: function(notification, payload) {
        switch(notification){
            case 'HOSTNAME':   { 
                
                this.hostname=payload.hostname.toString();
                this.address=payload.address.toString();
                Log.log("HOSTNAME:"+this.hostname);
                Log.log("IP Address: " + this.address);

                break;
            }
            case 'INCIDENT_INFO': {
                this.IncidentInfo=payload.number + ": State: "+payload.state + " Major? " +payload.major;
                Log.log("Received Incident Info: " + payload);
                this.updateDom();
            }
            default: 
                //Log.log(this.name + " received a SOCKET notification$$$$$: " + notification + " - Payload: " + payload);
        };
        
        
    },
    suspend: function(){
        Log.log(this.name + "was suspended.");
    },
    resume: function(){
        Log.log(this.name + "was resumed.");
    },
    // Send a notification to other modules:
    //      this.sendNotification('HOSNTAME_READY_FOR_ACTION');
    // Send a notification to your NODE HELPER:
    //      this.sendSocketNofitication(notiification,payload)
    //      this.sendSocketNotification('SET_CONFIG',this.config);
});
