const express = require('express'),
	bodyParser = require('body-parser'),
	path = require('path'),
	app = express();

	// const db = require('./model/sqliteController');
// const filesTools = require('./tools/fileTool');
/*const xml = require('./tools/readXls');
xml.readFile();*/

// require('dotenv').config();
// --------- CARGAR VISTAS --------- //
const productsUri = require('./modules/products/view');
const scraperUri = require('./modules/scraped/view');

const port = process.env._PORT || 8081;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(function(req, res, next) {
// 	res.header("Access-Control-Allow-Origin", "*");
// 	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
// 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
// 	res.header("Access-Control-Allow-Headers", "Origin,x-session-token, Content-Type, Accept");
// 	res.header('Access-Control-Allow-Credentials', true);
// 	next();
// });

// app.use('/public',express.static(path.join(__dirname, 'public')));
console.log(`ruta ${__dirname}`);
// app.use('/database',express.static(path.join(__dirname, 'database')));

/* Rutas */

app.use('/api/products', productsUri);
app.use('/api/scraper', scraperUri);

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

//------FUNCIONES INICIALES----
// setTimeout(createFolders, 3500);

// function createFolders(){
//   //Si no existen las carpetas necesarias, el sistema las crea
//   console.info("*** Verify folder structure ***");
// 	filesTools.createFolder('','public');
// 	//filesTools.createFolder('public/','package');
// }
