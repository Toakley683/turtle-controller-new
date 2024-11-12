const ngrok = require("@ngrok/ngrok");
const express = require('express');
const path = require('path');
const fs = require( 'fs' );

const expressApp = express();

class WebPanel {

    constructor( settings, onNewTurtleCallback, getTurtleData ) {

        this.settings = settings;
        this.setup();
        this.onNewTurtleCallback = onNewTurtleCallback;

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
        
        //[LINK]/turtle?Index=123210312031
        expressApp.get( "/turtle", ( req, res ) => {

            console.log( req.query.Index )

            fs.readFile( path.join( this.settings.Settings.Path, "Panel/Turtle/turtle.html" ), "utf-8", ( err, html ) => {

                const Split = html.split( "[TURTLE_NAME_HERE]" )

                res.send( Split.join( "" ) )
            })

        })


        expressApp.use(express.raw())
        expressApp.use(express.urlencoded({ extended: true }))

        expressApp.post( "/new_turtle", ( req, res ) => {

            this.onNewTurtleCallback( req.body, ( Data ) => {
                res.send( Data )
            })

        })

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