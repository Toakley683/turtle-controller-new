const ngrok = require("@ngrok/ngrok");
const express = require('express');
const path = require('path');

const expressApp = express();

class WebPanel {

    constructor( settings ) {

        this.settings = settings;
        this.setup();

    }

    setup() {

        expressApp.get( "/", ( req, res ) => { res.sendFile( path.join( this.settings.Settings.Path, "Panel/index.html" ) ) })
        expressApp.get( "/style.css", ( req, res ) => { res.sendFile( path.join( this.settings.Settings.Path, "Panel/style.css" ) ) })
        expressApp.get( "/script.js", ( req, res ) => { res.sendFile( path.join( this.settings.Settings.Path, "Panel/script.js" ) ) })
        expressApp.get( "/mining_turtle.png", ( req, res ) => { res.sendFile( path.join( this.settings.Settings.Path, "Resources/mining_turtle.png" ) ) })
        
        expressApp.post( "/new_turtle", ( req, res ) => {

            console.log( req.body )
            res.send("Test")

        })

        expressApp.listen( this.settings.Settings.WebsitePort, () => {
        
            console.log( `Listening on port ${ this.settings.Settings.WebsitePort }` );
        
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