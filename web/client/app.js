require("babel-polyfill");
const router = require('./router/client');

global.main = router.renderToString;

if (typeof window !== "undefined") {
	router.run();
}