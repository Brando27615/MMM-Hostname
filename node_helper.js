const fs = require('fs');
const os = require('os');
var DEBUG=false;

var NodeHelper = require("node_helper");
module.exports = NodeHelper.create({

    start: function() {
        // this.expressApp.get('/foobar', function (req, res) {
        //     res.send('GET request to /foobar');
        // });
        this.mySpecialProperty = "Any special property you want to use!";
        if (DEBUG){
            console.log("NODEHELPER-HOSTNAME: " + this.name + ' is started! Machine Name: '+ os.hostname());  
            console.log("Running in Filesystem Directory: " + __dirname);
            
            //fs.watch('test.txt',watchFiles());

        }
        else {
            console.log("DEBUG Mode is OFF");
        };
        
        // See if we can read a file

        var err;
        var data;
        
        //fs.readFile('./test.txt',(err,data)); 
        //if(err) throw err;
        //console.log("FILE: " + data);
        //fs.realpath('.',data)
        //console.log("PATH: " +data.toString());


    },
    
    stop: function() {
        console.log("Shutting down HOSTNAME");
        this.connection.close();
    },
    watchFiles: function() {
        console.log("FILE  CHANGED!!!");

    },
    socketNotificationReceived: function(notification, payload) {
        var myString='HELLO!!!!!';
        var machineObject = new Object();
        
        switch(notification){
            case 'GET_HOSTNAME': {
                machineObject.hostname=os.hostname();
                machineObject.address='x.x.x.x'; //getLinuxLocalIpv4();
                this.sendSocketNotification('HOSTNAME',machineObject);
                console.log("HOSTNAME: " + os.hostname());
                //this.sendSocketNotification('HOSTNAME',this.mySpecialProperty);
                break;
            }
            case 'GET_INCIDENT_INFO': {
                var incident = new Object();
                incident.number='INC8675309';
                incident.major=true;
                incident.state='New';
                fs.readFile('./modules/hostname/test.txt',(err,data) => {
                    if (err) throw err;
                    incident.number=data.toString();
                    //console.log("READ FILE!!!!: "+data.toString());
                });
            
                this.sendSocketNotification('INCIDENT_INFO',incident);
                break;
            }
            default: {
            // Not sure what the notification is for, post to console
                console.log(this.name + " received an UNSUPPORTED socket notification in Node Helper: " + notification + " - Payload: " + payload);
                // Send Notification to Client
               // this.sendSocketNotification('SENDING_ONE_BACK', this.mySpecialProperty);   
            };
        };
        
        
    },
});
