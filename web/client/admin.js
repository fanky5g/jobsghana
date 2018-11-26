require("babel-polyfill");
const router = require('./router/admin');

global.main = router.renderToString;

if (typeof window !== "undefined") {
	router.run();
}