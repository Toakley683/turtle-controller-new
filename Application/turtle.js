const ngrok = require("@ngrok/ngrok");

function getCardinal( FacingIndex ) {

    switch ( FacingIndex ) {
        case 1:
            return "NORTH";
        case 2:
            return "EAST";
        case 3: 
            return "SOUTH";
        case 4:
            return "WEST";
    }
    return nil;

}

class Turtle {

    constructor( Data, url, responseCallback ) {

        console.log( "New turtle created!" )

        this.x = Data.turtleX;
        this.y = Data.turtleY;
        this.z = Data.turtleZ;

        this.facing = Data.turtleFacing;
        this.cardinalFacing = getCardinal( this.facing )

        this.responseCallback = responseCallback;
        this.connectionURL = url;
        this.isConnected = false;

        this.connect()

        console.log( this )

    }

    connect() {



    }

}

class TurtleNetwork {

    constructor( settings, networkCreatedCB ) {

        this.settings = settings;
        this.networkCreatedCB = networkCreatedCB;

        ( async () => {
                
            const turtleListener = await ngrok.forward({
                addr: this.settings.Settings.TurtlePort,
                authtoken_from_env: false,
                authtoken: this.settings.Settings.NGROKAuthToken,
                proto: "tcp",
            });
        
            this.url = turtleListener.url();

            networkCreatedCB( this )
        
        })();

    }

}

module.exports = {
    Turtle,
    TurtleNetwork
}