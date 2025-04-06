const express = require('express'),
	bodyParser = require('body-parser'),
	path = require('path'),
	app = express();

// Documentation
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load(path.join(__dirname, 'api-docs/swagger.yaml'));

// Load environment variables
require('dotenv').config();

// Replace environment variables in swagger document
const port = process.env._PORT || 8081;
swaggerDocument.servers[0].url = swaggerDocument.servers[0].url.replace('${_PORT}', port);

// --------- CARGAR VISTAS --------- //
const productsUri = require('./presentation/products/view');
const scraperUri = require('./presentation/scraped/view');
const scraperNotificationsUri = require('./presentation/notifications/view');
const reportsUri = require('./presentation/reports/view');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

console.log(`path ${__dirname}`);

/* Paths */

// Serve swagger files statically
app.use('/api-docs', express.static(path.join(__dirname, 'api-docs')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
	explorer: true,
	swaggerOptions: {
		urls: [
			{
				url: '/api-docs/swagger.yaml',
				name: 'API Documentation'
			}
		]
	}
}));

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