const express = require('express'),
	bodyParser = require('body-parser'),
	path = require('path'),
	app = express();

// require('dotenv').config();
// --------- CARGAR VISTAS --------- //
const productsUri = require('./presentation/products/view');
const scraperUri = require('./presentation/scraped/view');
const scraperNotificationsUri = require('./presentation/notifications/view');
const reportsUri = require('./presentation/reports/view');

const port = process.env._PORT || 8081;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


console.log(`ruta ${__dirname}`);

/* Rutas */

app.use('/api/products', productsUri);
app.use('/api/scraper', scraperUri);
app.use('/api/notifications', scraperNotificationsUri);
app.use('/api/reports', reportsUri);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	let err = {};
	err.error = "No se encontro " + req.originalUrl;
	err.status = 404;
	res.status(404).send(err);

	//next(err);
});

app.listen(port);
console.log("Running on " + port);