
class TurtleEntry {
    constructor( name, parent, index ) {

        this.name = name;
        this.parent = parent;

        const main = document.createElement( "a" )

        const img = document.createElement( "img" )
        img.src = "mining_turtle.png"

        const label = document.createElement( "p" )
        label.innerHTML = this.name

        main.appendChild( img )
        main.appendChild( label )

        main.setAttribute( "href", "turtle?Index="+index )
        
        parent.appendChild( main )

    }
}

addEventListener( "load", () => {
    
    const parent = document.getElementsByClassName( "TurtleGrid" )[0]

    console.log( window.location.href )

    fetch( window.location + "get_turtles" )
        .then( async ( Data ) => {
            const json = await Data.json();

            Object.entries( json ).forEach( ( key, value ) => {
                new TurtleEntry( key[0], parent, key[1] )
            });

        })


})

function broadcastCommand( command ) {

    if ( command == null ) { return; };

    var xmlHTTP = new XMLHttpRequest();

    const data = "broadcast=1" + "&command=" + command

    xmlHTTP.open( "POST", "/turtle_broadcast_command", false )
    xmlHTTP.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHTTP.send( data );

    return JSON.parse( xmlHTTP.responseText );

}