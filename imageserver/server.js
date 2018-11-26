var express = require('express');
var ir = require('./index');
var streams = ir.streams;
var Img = ir.img;

var app = express();
var port  = 3001;

app.get('/modifiers.json', function(request, response){
  response.json(ir.modifiers);
});

app.get('/*?', function(request, response){
  var image = new Img(request);

  image.getFile()
    .pipe(new streams.identify())
    .pipe(new streams.resize())
    .pipe(new streams.filter())
    .pipe(new streams.optimize())
    .pipe(streams.response(request, response));
});

app.listen(port, function(error) {
	if (error) {
        console.error(error);
    } else {
        console.info("==> 🌎  Imageserver listening on port %s. Open up http://localhost:%s/ in your browser.", port, port);
    }
});