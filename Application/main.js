const ngrok = require("@ngrok/ngrok");

const { Settings } = require( "./settings" )

const settings = new Settings

console.log( settings.Settings[ "AuthToken" ] )

return

(async function () {
	const websiteListener = await ngrok.forward({
		addr: 8080,
		authtoken_from_env: false,
        authtoken: AuthToken,
		proto: "http",
	});

	const turtleListener = await ngrok.forward({
		addr: 8080,
		authtoken_from_env: false,
        authtoken: AuthToken,
		proto: "tcp",
	});

	console.log(`Ingress established at: ${websiteListener.url()}`);
	console.log(`Ingress established at: ${turtleListener.url()}`);
})();