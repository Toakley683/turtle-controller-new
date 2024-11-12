const { Settings } = require( "./settings" );
const { WebPanel } = require( "./webpanel" );
const { Turtle } = require( "./turtle" );
const { TurtleNetwork } = require( "./turtle" )

Turtles = new Map();

const settings = new Settings( () => {

    console.log( settings.Settings );

    new TurtleNetwork( settings, ( network ) => {

        // On network created

        const panel = new WebPanel( settings, ( Data, ResponseCallback ) => {

            const turtleObject = new Turtle( Data, network.url, responseCallback );

            Turtles.set( Data.index, turtleObject )

        })
        
    })

});