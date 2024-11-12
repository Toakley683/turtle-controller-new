const { Settings } = require( "./settings" );
const { WebPanel } = require( "./webpanel" );
const { Turtle, getTurtleList } = require( "./turtle" );
const { TurtleNetwork } = require( "./turtle" )

const settings = new Settings( () => {

    new TurtleNetwork( settings, ( network ) => {

        // On network created

        const panel = new WebPanel( settings, ( Data, responseCallback ) => {

            const turtleObject = new Turtle( Data, network.url, responseCallback );

        }, getTurtleList )
        
    })

});