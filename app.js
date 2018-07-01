'use strict'

var express=require('express');
var bodyParser=require('body-parser');

var path=require('path');

var app=express(); //Load express framework

//Cargamos rutas
var user_routes=require('./routes/user');
var tag_routes=require('./routes/tag');
var post_routes=require('./routes/post');
var category_routes=require('./routes/category');
var comment_routes=require('./routes/comment');
var photo_routes=require('./routes/photo');
var event_routes=require('./routes/event');

var mail_routes=require('./routes/mail');


//Middleware. Esto se ejecuta antes de nada.

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//Configuracion cabeceras y CORS
app.use((req,res,next)=> {

	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Headers', 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request_Method, Authorization');
	res.header('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT,DELETE');
	res.header('Allow','GET,POST,OPTIONS,PUT,DELETE');
	next();
});

//Rutas base

app.use('/api', user_routes); //Con esto añadimos el prefijo api. Ejemplo: localhost:3789/api/probando-ruta
app.use('/api',tag_routes);
app.use('/api',post_routes);
app.use('/api',category_routes);
app.use('/api',comment_routes);
app.use('/api',photo_routes);
app.use('/api',event_routes);
app.use('/api',mail_routes);

//DESCOMENTAR AL SUBIR AL SERVER
app.use('/', express.static('client/browser',{redirect: false})); 
app.use(express.static('public'));//Hacemos publico el directorio Post. No hay que meter la carpeta public en la ruta.
app.get('*', function(req,res,next){
	res.sendFile(path.resolve('client/browser/index.html'));
});

app.use(express.static('public'));//Hacemos publico el directorio Post. No hay que meter la carpeta public en la ruta.

app.get('/probando', (req,res)=>{
	res.status(200).send({message:'Este es el metodo de prueba'});

});

module.exports=app; //Exportamos el modulo para poder importarlo en otro sitio. En este caso en index.js