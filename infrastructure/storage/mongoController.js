require('dotenv').config();
const MongoClient = require('mongodb').MongoClient,
Server = require('mongodb').Server,
ObjectID = require('mongodb').ObjectID;
const assert = require('assert');
const { Console } = require('console');

let mongoclient;
let db;
let oStatus = {
	isLoaded : false,
	connected : false
};
//------------------------PARA DESARROLLO------------------------
const dbName	= process.env.MONGO_DB_NAME ;
const host 		= process.env.MONGO_DB_HOST || "localhost";
const puerto	= process.env.MONGO_DB_PORT || "27017";
const usuario 	= process.env._DB_USER ;
const password 	= process.env._DB_PWD;
let autentica = process.env.MONG0_DB_AUTH || false;
if(autentica == "true") autentica = true;
if(autentica == "false") autentica = false;
//------------------Funciones privadas------------------

const dbOper = {
	aggregate : aggregate,
	select : select,
	find : find,
	add : add,
	update : update,
	del : del,
	status : status,
	getObjetId: getObjetId,
}

const urlConnection = 'mongodb://' + host + ":" + puerto + "/" + dbName;

async function connect(){
	const client = new MongoClient(urlConnection);
	console.log(`urlConnection ${urlConnection}`);
	async function initDatabase() {
		try {
			console.log('intentando concectar');
			// Conectar al servidor de MongoDB
			await client.connect();
	
			// Obtener la base de datos (si no existe, se crea automáticamente)
			db = client.db(dbName);
	
			// Obtener la colección (si no existe, se crea automáticamente)
			// const collection = db.collection('products_scraped');
			await db.collection('products_scraped');
			await db.collection('product_scraped_records');
	
			console.log('Base de datos y colección creadas correctamente.');
	
			oStatus.isLoaded = true;
			oStatus.connected = true;
	
		} catch (error) {
			console.error('Error al crear la base de datos y la colección:', error);
		} finally {
			// Cerrar la conexión con el cliente de MongoDB
			// await client.close();
		}
	}
	
	// Llamar a la función para crear la base de datos y la colección
	initDatabase();
}

function status(){
	return oStatus;
}

async function aggregate(param,callback){
	let respond = {};
	try{
		db.collection(param.coleccion).aggregate(param.condicion,onFind);
	}
	catch(error){
		respond.status = "error";
		respond.error = "Error interno. " + error;
		callback(respond);
	}

	function onFind(err,doc){
		if(err){
			respond.status = "error-bd";
			respond.error = "Hubo problemas al ejectuar aggregate en la BD. " + err;
		 }
		else{
			respond.status = "ok";
			respond["data"] = doc;
		}
		callback(respond);
	}
}

function select(param,callback){
	let respond = {};

	try{
		if(!param.opcion) param.opcion = {};
		if(!param.condicion) param.condicion = {};
		if(!param.limit) param.limit = 0;
		if(!param.skip) param.skip = 0;
		if(!param.sort) param.sort = {};

		db.collection(param.coleccion).find(param.condicion,param.opcion)
		.limit(param.limit)
		.skip(param.skip)
		.sort(param.sort)
		.toArray(onFind);

	}
	catch(error){
		respond.status = "error";
		respond.error = "Error interno. " + error;
		callback(respond);
	}

	function onFind(err,doc){
		if(err){
			respond.status = "error-bd";
			respond.error = "Hubo problemas al consular en la BD. " + err;
		 }
		else{
			respond.status = "ok";
			if(doc.length > 0) respond["data"] = doc;
			else respond["data"] = [];
		}
		callback(respond);
	}
}

async function find(nameCollection, params = {}, options = {}){
	let respond = {};

	try{
		const responseOperation = await db.collection(nameCollection).find(params, options).toArray();
		if(responseOperation.err){
			respond.status = "error-bd";
			respond.error="Hubo problemas al obtener el registro en la BD. " + err;
		 }
		else{
			respond.status = "ok";
			respond.message = "Se consultó correctamente";
			respond.data = responseOperation;
		}
		return respond;

	}
	catch(error){
		respond.status = "error";
		respond.error = "Error interno. " + error;
		return respond;
	}
}

async function update(nameCollection, condition = {}, updatedDocument = {}) {
	let respond = {};
	try{
		const responseOperation = await db.collection(nameCollection).updateOne(condition, { $set: updatedDocument });
		if(responseOperation.err){
			respond.status = "error-bd";
			respond.error="Hubo problemas al actualizar en la BD. "+err;
		 }
		else{
			respond.status = "ok";
			respond.message = "Se actualzó correctamente";
		}
		return respond;
	}
	catch(error){
		console.log(error);
		respond.status = "error";
		respond.error = "Error interno. "+error;
		return respond;
	}
}


async function add(nameCollection, doc, options = {}) {
	let respond = {};
	try{
		const responseOperation = await db.collection(nameCollection).insertOne(doc, options);
		if(responseOperation.err){
			respond.status = "error-bd";
			respond.error="Hubo problemas al insertar registro en la BD. " + err;
		 }
		else{
			respond.status = "ok";
			respond.message = "Se registró correctamente";
			respond.data = responseOperation;
			console.log(responseOperation);
		}
		return respond;
	}
	catch(error){
		respond.status = "error";
		respond.error = "Error interno. "+error;
		return respond;
	}
}

function getObjetId(id) {
	try {
		return ObjectID(id);
	} catch(err) {
		console.log(err);
		console.log('ERROR EN getObjetId');
	}
}

function del(param,callback){
	//Actualiza
	let respond = {};
	try{
		db.collection(param.coleccion).remove(param.condicion,param.opcion,function(err){

			if(err){
				respond.status = "error-bd";
				respond.error="Hubo problemas al eliminar registro en la BD. " + err;
			 }
			else{
				respond.status = "ok";
				respond.message = "Se elimino correctamente";
			}

			callback(respond);

		});

	}
	catch(error){
		respond.status = "error";
		respond.error = "Error interno. "+error;
		callback(respond);
	}
}

//*-----------------INIT------------------------------
(function () {
  if (!db) dbCouchInstance = connect();
})();

//------------------Funciones publicas------------------
module.exports = dbOper;
