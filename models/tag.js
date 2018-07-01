'use strict'

var mongoose=require('mongoose');
var Schema=mongoose.Schema;


var tagSchema=Schema({
	name:String
});

/*
* El modelo se llama Post. Pero luego mongoose llamará a la Colección Posts. Usando el esquema que se ha creado usando Schema.
*/
module.exports=mongoose.model('Tag',tagSchema);