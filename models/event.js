'use strict'

var mongoose=require('mongoose');
var Schema=mongoose.Schema;


var eventSchema=Schema({

	autor:{ type:Schema.ObjectId, ref: 'User' },
	category:{ type:Schema.ObjectId, ref: 'Category' },
	fechaInicio:{type:Date, default:Date.now},
	fechaFin:{type:Date, default:Date.now},
	mensaje:String,
	titulo: String, 
	eventoConcluido: Boolean,
	fotos:[{type:Schema.ObjectId, ref: 'Photo' }]

});

/*
* El modelo se llama Event. Pero luego mongoose llamará a la Colección Events. Usando el esquema que se ha creado usando Schema.
*/
module.exports=mongoose.model('Event',eventSchema);