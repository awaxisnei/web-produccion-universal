'use strict'

var mongoose=require('mongoose');
var Schema=mongoose.Schema;


var userSchema=Schema({

	name:String,
	user:String,
	email:String,
	password:String,
	role: String, //Hacemos referencia a un objeto Role.
	newsletter:Boolean,
	image:String

});

/*
* El modelo se llama User. Pero luego mongoose llamará a la Colección Users. Usando el esquema que se ha creado usando Schema.
*/
module.exports=mongoose.model('User',userSchema);