'use strict'

var mongoose=require('mongoose');
var Schema=mongoose.Schema;


var commentSchema=Schema({

	user:{ type:Schema.ObjectId, ref: 'User' },
	post:{ type:Schema.ObjectId, ref: 'Post' },
	mensaje:String

});

/*
* El modelo se llama Comment. Pero luego mongoose llamará a la Colección Posts. Usando el esquema que se ha creado usando Schema.
*/
module.exports=mongoose.model('Comment',commentSchema);