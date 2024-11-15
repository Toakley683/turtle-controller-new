const ngrok = require("@ngrok/ngrok");
const { WebSocket, WebSocketServer } = require( "ws" );

const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

function getCardinal( FacingIndex ) {

    switch ( Number( FacingIndex ) ) {
        case 1:
            return "NORTH";
        case 2:
            return "EAST";
        case 3: 
            return "SOUTH";
        case 4:
            return "WEST";
    }
    return null;

}

function getForwardPosition( FacingIndex, x, y, z ) {

    switch ( Number( FacingIndex ) ) {
        case 1:
            return { x: x, y: y, z: z - 1 }; // NORTH
        case 2:
            return { x: x + 1, y: y, z: z }; // EAST
        case 3: 
            return { x: x, y: y, z: z + 1 }; // SOUTH
        case 4:
            return { x: x - 1, y: y, z: z }; // WEST
    }
    return { x: x, y: y, z: z };

}

Turtles = new Map();

function getTurtleList() { return Turtles }

class Turtle {

    constructor( Data, url, responseCallback ) {

        console.log( "New turtle created!" )

        Turtles.set( Data.index, this )

        this.index = Data.index;
        this.name = Data.name;

        this.x = Data.turtleX;
        this.y = Data.turtleY;
        this.z = Data.turtleZ;

        this.commands = new Map();

        this.facing = Number( Data.turtleFacing );
        this.cardinalFacing = getCardinal( this.facing )

        this.responseCallback = responseCallback;
        this.connectionURL = url;
        this.isConnected = false;

        this.connect()

    }

    connect() {

        this.responseCallback( this.connectionURL )

    }

    onConnect( webSocket ) {

        this.webSocket = webSocket;
        this.isConnected = true;

    }

    checkMoved( jsonData, commandData ) {

        if ( jsonData.Result[0] == false ) { return; }
            
        if ( commandData.command == "turtle.forward()" ) { this.movedForward() }
        if ( commandData.command == "turtle.turnRight()" ) { this.turnedRight() }
        if ( commandData.command == "turtle.turnLeft()" ) { this.turnedLeft() }

    }

    movedForward() {

        const newPos = getForwardPosition( this.facing, this.x, this.y, this.z )

        this.x = newPos.x;
        this.y = newPos.y;
        this.z = newPos.z;
        
        console.log( newPos )

    }

    turnedRight() {
        
        this.facing++
        if( this.facing > 4 ) { this.facing = 1 }
        
        this.cardinalFacing = getCardinal( this.facing )

        console.log( this.cardinalFacing );

    }

    turnedLeft() {
        
        this.facing--
        if( 1 > this.facing ) { this.facing = 4 }
        
        this.cardinalFacing = getCardinal( this.facing )

        console.log( this.cardinalFacing );

    }

    onSpeak( Message ) {

        let jsonData;

        try {
            jsonData = JSON.parse( Message )
        } catch (error) {

            if ( error == "Unexpected end of JSON input" ) { return }

            console.log( error )
        }

        if( this.commands.get( jsonData.ID ) != null ) {

            const commandData = this.commands.get( jsonData.ID );

            commandData.callback( jsonData.Result );

            this.checkMoved( jsonData, commandData );
        
            const sentData = {
                x: this.x,
                y: this.y,
                z: this.z,
                facing: this.facing,
            }
    
            this.webSocket.send( JSON.stringify( sentData ) );
            
            this.commands.delete( jsonData.ID );

        }

    }

    __new_command( command, callback ) {

        let UCommandID = ""

        for (let x = 0; x < 128; x++) {

            const charIndex = Math.floor(Math.random() * alphabet.length );
            const char = alphabet.charAt( charIndex )

            UCommandID = UCommandID + char;

        }

        const commandData = 
        { 
            ID: UCommandID,
            command: command, 
            callback: callback 
        };

        this.commands.set( UCommandID, commandData );
        
        const sentData = {
            ID: UCommandID,
            command: command, 
            x: this.x,
            y: this.y,
            z: this.z,
            facing: this.facing,
        }

        return JSON.stringify( sentData );

    }

    send_command( command, callback ) {

        if ( !this.isConnected ) { return; };

        this.webSocket.send( this.__new_command( command, ( Value ) => {

            callback( Value )

        }))

    }

}

class TurtleNetwork {

    constructor( settings, networkCreatedCB ) {

        this.settings = settings;
        this.networkCreatedCB = networkCreatedCB;

        this.socketServer = new WebSocketServer( 
            {
                port:this.settings.Settings.TurtlePort,
            }
        );

        this.ConnectedTurtles = new Map();
        
        this.socketServer.on( "connection", ( ws ) => {

            ws.on( "message", ( Data ) => {

                const plainText = Data.toString( 'utf-8' )

                let jsonData;

                try {
                    jsonData = JSON.parse( plainText )
                } catch (error) {

                    if ( error == "Unexpected end of JSON input" ) { return }

                    console.log( error )
                }

                if ( jsonData[ "index" ] ) {

                    if ( this.ConnectedTurtles.get( ws ) == null ) {
    
                        // Is new turtle

                        const turtle = Turtles.get( jsonData[ "index" ] )
                        
                        turtle.onConnect( ws )

                        this.ConnectedTurtles.set( ws, turtle )
    
                    }

                }

                if ( this.ConnectedTurtles.get( ws ) != null ) {

                    if( jsonData.index != null ) { return }

                    this.ConnectedTurtles.get( ws ).onSpeak( plainText )

                }

            })

            ws.on( "close", () => {
                this.ConnectedTurtles.isConnected = false;
                this.ConnectedTurtles.delete()
            })

        });

        ( async () => {
                
            const turtleListener = await ngrok.forward({
                addr: this.settings.Settings.TurtlePort,
                authtoken_from_env: false,
                authtoken: this.settings.Settings.NGROKAuthToken,
                proto: "tcp",
            });
        
            this.url = "ws://" + turtleListener.url().split( "://" )[1];

            networkCreatedCB( this )
        
        })();

    }

}

module.exports = {
    Turtle,
    getTurtleList,
    TurtleNetwork
}