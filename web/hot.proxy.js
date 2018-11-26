var webpack = require('webpack');
var fs = require('fs');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var proxy = require('express-http-proxy');
var wconfig = require('./webpack.config');
var port = +(process.env.PORT || 5000);
var vhost = require('vhost');
var config = {};
var admincfg = {};

if (Array.isArray(wconfig)) {
    config = wconfig.find((cfgEntry) => cfgEntry.target === 'web');
    admincfg = wconfig[2];
}

var targetUrl = 'http://localhost:' + port;
var adminUrl = 'http://admin.localhost:' + port;

config.entry = {
    client: [
        'webpack-hot-middleware/client?http://localhost:' + port,
        config.entry.client,
    ],
};

admincfg.entry = {
    admin: [
        'webpack-hot-middleware/client?http://admin.localhost:' + port,
        admincfg.entry.admin,
    ],
};

config.plugins.push(
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
);

admincfg.plugins.push(
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
);

config.devtool = 'cheap-module-eval-source-map';
admincfg.devtool = 'cheap-module-eval-source-map';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var compiler = webpack(config);
var acompiler = webpack(admincfg);

const isMultipartRequest = function (req) {
  let contentTypeHeader = req.headers['content-type'];
  return contentTypeHeader && contentTypeHeader.indexOf('multipart') > -1;
};

const proxyMiddleware = function (apiUrl) {
  return function (req, res, next) {
    let reqAsBuffer = false;
    let reqBodyEncoding = true;
    let parseBodyReq = true;
    let contentTypeHeader = req.headers['content-type'];
    if (isMultipartRequest(req)) {
      reqAsBuffer = true;
      reqBodyEncoding = null;
      parseBodyReq = false;
    }
    return proxy(apiUrl, {
      reqAsBuffer,
      reqBodyEncoding,
      parseBodyReq,
      timeout: 300000,//300s
    })(req, res, next);
  };
};

const bodyParserJsonMiddleware = function () {
  return function (req, res, next) {
    if (isMultipartRequest(req)) {
      return next();
    }
    return bodyParser.json({limit: '50mb'})(req, res, next);
  };
};

app.use(bodyParserJsonMiddleware());
app.use(vhost('xxxinafrica.dev', webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath })))
app.use(vhost('xxxinafrica.dev', webpackHotMiddleware(compiler)));
app.use(vhost('xxxinafrica.dev', proxyMiddleware(targetUrl)));

app.use(vhost('admin.xxxinafrica.dev', webpackDevMiddleware(acompiler, { noInfo: true, publicPath: admincfg.output.publicPath })))
app.use(vhost('admin.xxxinafrica.dev', webpackHotMiddleware(acompiler)));
app.use(vhost('admin.xxxinafrica.dev', proxyMiddleware(adminUrl)));

port++

app.listen(port, function(error) {
    if (error) {
        console.error(error);
    } else {
        console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port);
    }
});
