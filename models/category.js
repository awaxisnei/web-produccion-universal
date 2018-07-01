'use strict'

var mongoose=require('mongoose');
var Schema=mongoose.Schema;


var categorySchema=Schema({

	name:String,
	description:String,
	tag:[{ type:Schema.ObjectId, ref: 'Tag' }]

});

/*
* El modelo se llama Post. Pero luego mongoose llamará a la Colección Posts. Usando el esquema que se ha creado usando Schema.
*/
module.exports=mongoose.model('Category',categorySchema);