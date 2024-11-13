    let Index = null;

    addEventListener( "load", () => {

        Index = document.getElementsByClassName( "Index" )[0].getAttribute( "href" )

    })

    function turtle_send( command ) {

        if ( Index == null ) { return; };
        if ( command == null ) { return; };

        var xmlHTTP = new XMLHttpRequest();

        const Data = {}

        Data.Index = Index;
        Data.Command = command;

        xmlHTTP.open( "POST", "/send_request", false )
        xmlHTTP.send( JSON.stringify( Data ) );

        return xmlHTTP.responseText;

    }