require('dotenv').config({path: './config.dev.env'});

var express = require('express'),
app = express(),
port = process.env.PORT || 6666
mongoose = require('mongoose'),
Users = require('./users/models/scUserApiModel'), //created model loading here
bodyParser = require('body-parser');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/scLicense');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var license_routes = require('./license/routes/scLicenseRoutes'); //importing route
var user_routes = require('./users/routes/scUserRoutes'); //importing route
license_routes(app); //register the route
user_routes(app); //register the route

app.listen(port);
console.log('Self Control API server started on: ' + port);
if (port=='6666'){
     console.log('WARNING port 6666 is the default port, env file may not have been loaded.');
};

module.exports=app;
