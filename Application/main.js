const { Settings } = require( "./settings" );
const { WebPanel } = require( "./webpanel" );
const { Turtle, getTurtleList } = require( "./turtle" );
const { TurtleNetwork } = require( "./turtle" )

const settings = new Settings( () => {

    new TurtleNetwork( settings, ( network ) => {

        // On network created

        const panel = new WebPanel( settings, ( Data, responseCallback ) => {

            const turtleObject = new Turtle( Data, network.url, responseCallback );

        }, getTurtleList, ( req, res ) => {

            if( req.body.broadcast ) {

                const command = req.body.command;
                let Returns = {};
                let Turtles = getTurtleList()

                Turtles.forEach( ( value, key, map ) => {
                    value.send_command( command, ( Result ) => {
                        
                        Returns[ value.name ] = Result;

                        if( Object.keys( Returns ).length == Turtles.size ) {

                            res.send( JSON.stringify( Returns ) )

                        }
        
                    })
                });
                
                return
                
            }

            const index = req.body.index;
            const command = req.body.command;

            let Turtles = getTurtleList();

            const Turtle = Turtles.get( index )

            Turtle.send_command( command, ( Result ) => {

                res.send( JSON.stringify( Result ) )

            })

        })
        
    })

});