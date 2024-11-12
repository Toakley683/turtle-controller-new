const fs = require( "fs" );

const BaseDirectory = "./Data/"

class Settings {

    constructor( Callback ) {

        this.Callback = Callback;

        this.fileName = "settings.json"
        this.finalDirectory = BaseDirectory + this.fileName

        this.Settings = this.defaultSettings();
        
        this.exists();

    }

    exists() {

        fs.exists( this.finalDirectory, ( exists ) => {

            switch( exists ) {

                case true:
                    this.readFile()
                    return
                case false:
                    this.createFile()
                    return

            }

        })

    }

    createFile() {

        fs.writeFile( this.finalDirectory, JSON.stringify( this.Settings, 0, 4 ), () => {

            this.exists()

        })

    }

    readFile() {

        fs.readFile( this.finalDirectory, "utf-8", ( err, data ) => {

            let Data = null

            try {

                Data = JSON.parse( data )
                
            } catch( error ) {

                if( error == "SyntaxError: Unexpected end of JSON input" ) {
                    throw( "Settings has INVALID json" )
                }

                this.createFile()

            }

            if ( Data == null ) { this.createFile; return; }

            Object.entries( Data ).forEach( e => { this.Settings[ e[0] ] = e[1] });

            this.Callback()
            
        })

    }

    defaultSettings() {

        const Data = {}

        Data.NGROKAuthToken = "AUTH_TOKEN_HERE";
        Data.WebsitePort = 8080;
        Data.TurtlePort = 8081;
        Data.Path = __dirname + "./../"

        return Data;

    }

}

module.exports = {
    Settings
}