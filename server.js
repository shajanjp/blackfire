var mongoose = require('./config/mongoose'),
express = require('./config/express');

var db = mongoose();
var	app = express();

app.listen(3000, function() {
	console.log('Server running at the machine http://localhost:3000 in ' + process.env.NODE_ENV);
});