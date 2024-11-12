
class TurtleEntry {
    constructor( name, parent ) {

        this.name = name;
        this.parent = parent;

        const main = document.createElement( "div" )

        const img = document.createElement( "img" )
        img.src = "mining_turtle.png"

        const label = document.createElement( "p" )
        label.innerHTML = this.name

        main.appendChild( img )
        main.appendChild( label )

        parent.appendChild( main )

    }
}

addEventListener( "load", () => {
    
    const parent = document.getElementsByClassName( "TurtleGrid" )[0]

    for (let i = 0; i < 100; i++) {

        new TurtleEntry( "Turtle " + ( i + 1 ), parent )

    }


})