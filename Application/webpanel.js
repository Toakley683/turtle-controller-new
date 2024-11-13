const ngrok = require("@ngrok/ngrok");
const express = require('express');
const path = require('path');
const fs = require( 'fs' );

const expressApp = express();

class WebPanel {

    constructor( settings, onNewTurtleCallback, getTurtleData, onCommandSend ) {

        this.settings = settings;
        this.setup();
        this.onNewTurtleCallback = onNewTurtleCallback;
        this.onCommandSend = onCommandSend;

        this.getTurtleData = getTurtleData;

        this.turtles = new Map()
        this.regetTurtles()

    }

    regetTurtles() {

        setTimeout( () => {
            
            this.turtles = new Map()
            
            this.getTurtleData().forEach( ( Value, Key, Map ) => {

                this.turtles.set( Value.name, Value.index )

            })

            this.regetTurtles()

        }, 1000 );

    }

    setup() {

        expressApp.get( "/", ( req, res ) => { res.sendFile( path.join( this.settings.Settings.Path, "Panel/index.html" ) ) })
        expressApp.get( "/style.css", ( req, res ) => { res.sendFile( path.join( this.settings.Settings.Path, "Panel/style.css" ) ) })
        expressApp.get( "/script.js", ( req, res ) => { res.sendFile( path.join( this.settings.Settings.Path, "Panel/script.js" ) ) })
        expressApp.get( "/mining_turtle.png", ( req, res ) => { res.sendFile( path.join( this.settings.Settings.Path, "Resources/mining_turtle.png" ) ) })
        
        expressApp.get( "/turtle.css", ( req, res ) => { res.sendFile( path.join( this.settings.Settings.Path, "Panel/Turtle/turtle.css" ) ) })
        expressApp.get( "/client.js", ( req, res ) => { res.sendFile( path.join( this.settings.Settings.Path, "Panel/Turtle/client.js" ) ) })
        
        expressApp.get( "/turtle", ( req, res ) => {

            const data = this.getTurtleData().get( req.query.Index );
            
            if( data ) {

                fs.readFile( path.join( this.settings.Settings.Path, "Panel/Turtle/turtle.html" ), "utf-8", ( err, html ) => {
    
                    let IndexSplit = html.split( "[TURTLE_INDEX_HERE]" )

                    IndexSplit = IndexSplit.join( data.index )

                    let NameSplit = IndexSplit.split( "[TURTLE_NAME_HERE]" )
    
                    res.send( NameSplit.join( data.name ) )
                })

            } else {

                res.send( "Invalid turtle ID" )

            }

        })

        expressApp.use(express.raw())
        expressApp.use(express.urlencoded({ extended: true }))

        expressApp.post( "/new_turtle", ( req, res ) => {

            this.onNewTurtleCallback( req.body, ( Data ) => {
                res.send( Data )
            })

        });

        expressApp.post( "/turtle_command", ( req, res ) => {

            this.onCommandSend( req, res )

        });

        expressApp.post( "/turtle_broadcast_command", ( req, res ) => {

            this.onCommandSend( req, res )

        });

        expressApp.get( "/get_turtles", ( req, res ) => {
            
            console.log( this.turtles )

            res.send( JSON.stringify( Object.fromEntries( this.turtles ), 0 ) );

        })

        expressApp.listen( this.settings.Settings.WebsitePort, () => {
        
            ( async () => {
            
                const websiteListener = await ngrok.forward({
                    addr: this.settings.Settings.WebsitePort,
                    authtoken_from_env: false,
                    authtoken: this.settings.Settings.NGROKAuthToken,
                    proto: "http",
                });
            
                console.log(`NGROK Tunnel at: ${websiteListener.url()}`);
            
            })();
        
        });

    }

}

module.exports = {
    WebPanel
}