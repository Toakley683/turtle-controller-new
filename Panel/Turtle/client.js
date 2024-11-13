let Index = null;

addEventListener( "load", () => {

    Index = document.getElementsByClassName( "Index" )[0].getAttribute( "href" )

})

function turtle_send( command ) {

    if ( Index == null ) { return; };
    if ( command == null ) { return; };

    var xmlHTTP = new XMLHttpRequest();

    const data = "index=" + Index + "&command=" + command

    console.log( data )

    xmlHTTP.open( "POST", "/turtle_command", false )
    xmlHTTP.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHTTP.send( data );

    return xmlHTTP.responseText;

}