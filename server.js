let config = require('./config/env');
var mongoose = require('./config/mongoose')
var express = require('./config/express');
var db = mongoose();
var	app = express();

app.listen(config.app.port, function() {
	console.log(`Server started at http://localhost:${config.app.port} using ${process.env.NODE_ENV || "default"} config file`);
});