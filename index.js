'use strict' //Puede utilizar nuevas instrucciones de los nuevos standard de Javascript EcmaScript6

var mongoose=require('mongoose');
var app=require('./app'); //Importamos app.js
var port=process.env.PORT || 3789; //Si tuvieramos variable de entorno en el sistema or un puerto que queramos.


/*mongoose.connect('mongodb://localhost:27017/luismiguelweb',
	(err,res)=>{
		if(err){
			throw err;
		}
		else{
			console.log('La conexión a la base de datos luismiguelweb ha sido establecida correctamente...');
		}
});*/

mongoose.Promise=global.Promise; //Usa la Promise de ES6, mongoose la usará
mongoose.connect('mongodb://localhost:27017/luismiguelweb',{ useMongoClient:true })
	.then(() => {
		console.log('La conexión a la base de datos luismiguelweb ha sido establecida correctamente...');

		//Cuando hayamos establecido conexion con la BD, arrancamos el servidor local.
		app.listen(port,()=>{
			console.log('El servidor web local con Node y Express está corriendo correctamente...');

		});
	})
	.catch(err => console.log(err));