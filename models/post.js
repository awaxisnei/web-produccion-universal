'use strict'

var mongoose=require('mongoose');
var Schema=mongoose.Schema;


var postSchema=Schema({

	autor:{ type:Schema.ObjectId, ref: 'User' },
	category:{ type:Schema.ObjectId, ref: 'Category' },
	fecha:{type:Date, default:Date.now},
	mensaje:String,
	titulo: String, 
	fecha:{type:Date, default:Date.now},
	fotos:[{type:Schema.ObjectId, ref: 'Photo' }],
	portada:String

});

/*
* El modelo se llama Post. Pero luego mongoose llamará a la Colección Posts. Usando el esquema que se ha creado usando Schema.
*/
module.exports=mongoose.model('Post',postSchema);