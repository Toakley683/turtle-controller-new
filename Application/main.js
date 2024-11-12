const { Settings } = require( "./settings" );
const { WebPanel } = require( "./webpanel" );

const settings = new Settings( () => {

    console.log( settings.Settings )

    const panel = new WebPanel( settings )

});