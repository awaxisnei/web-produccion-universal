'user strict'

//Cargar modelos
var Event=require('../models/event');

//Funciones GET*****************
function pruebas(req,res)
{
	res.status(200).send({
		message: 'Probando el controlador para un evento'
	});
}

function saveEvent(req,res)
{

	var event =new Event();//Creamos un nuevo Tag

	//Recogemos los parámetros (body) de la petición
	var params=req.body; //body parser se encarga de parsearlo a JSON
	//console.log(params);
	//Asignar valores al objeto User
	if(params.mensaje && params.titulo && params.autor)
	{
	
		event.autor=params.autor;

		if(params.category!='')
		{
			event.category=params.category;
		}
		if(!params.fechaInicio)
		{
			event.fechaInicio=Date.now();
		}else{
			event.fechaInicio=params.fechaInicio;
		}

		if(!params.fechaFin)
		{
			event.fechaFin=Date.now(); //No tiene fecha de fin.
		}else{
			event.fechaFin=params.fechaFin;
		}

		if(!params.concluido)
		{
			event.eventoConcluido=false;
		}
		else{
			event.eventoConcluido=true;
		}

		event.mensaje=params.mensaje;
		event.titulo=params.titulo;
		//post.comentario=[];
		event.fotos=params.fotos;

			
	    event.save((err,eventStored)=>{
		if(err)
		{
			res.status(500).send({message: 'Error al guardar el Evento. Error -->'+err});
			}else{
			    if(!eventStored)
					{
						res.status(404).send({message:'No se ha ha registrado el Evento'});
					}else{
							res.status(200).send({event: eventStored})
						 }
				}
		});

				
			
	}else{
		res.status(404).send({
			message:'Introduce los datos correctamente'
		});
	}

}

function deleteEvent(req,res){
	var eventId=req.params.id;

	Event.findByIdAndRemove(eventId, (err, eventRemoved) =>{
		if(err){
			res.status(500).send({message:'Error al intentar eliminar el event'});
		}else{
			if(!eventRemoved)
			{
				res.status(500).send({message:'No existe el ID del evento a eliminar. No se ha borrado ningún event.'});
			}
			else{
				res.status(200).send({event: eventRemoved});
			}
		}
	});
}

/*Populate de varios niveles*/
function getEvents(req,res)
{
	var event =new Event();//Creamos un nuevo usuario

	//Recogemos los parámetros (body) de la petición
	var params=req.body; //body parser se encarga de parsearlo a JSON


		//Añadimos un usuario si no existe ya antes
		//Este método devuelve vacío si no encuentra nada.
		Event.find({}).populate({path:'autor'}).populate({path:'category',populate: { path:'tag'}}).populate({path:'fotos'}).exec((err, getEvent)=>{
			//Si hay error al comprobar el usuario.
			if(err){
				res.status(500).send({message: 'Error al comprobar si existe el evento. Error -->'+err});
			}
			else{
				if(!getEvent)
				{
					res.status(200).send({
						message:'No existe ningún evento.'
					});
				}
				else{
					res.status(200).send({
						event:getEvent
					});
				}	
				
			}

		});
			
}


function getEventsConcluidos(req,res)
{
	var event =new Event();//Creamos un nuevo usuario

	//Recogemos los parámetros (body) de la petición
	var params=req.body; //body parser se encarga de parsearlo a JSON


		//Añadimos un usuario si no existe ya antes
		//Este método devuelve vacío si no encuentra nada.
		Event.find({eventoConcluido:true}).sort({fechaFin:-1}).limit(5).populate({path:'autor'}).populate({path:'category',populate: { path:'tag'}}).populate({path:'fotos'}).exec((err, getEvent)=>{
			//Si hay error al comprobar el usuario.
			if(err){
				res.status(500).send({message: 'Error al comprobar si existe el evento. Error -->'+err});
			}
			else{
				if(!getEvent)
				{
					res.status(200).send({
						message:'No existe ningún evento.'
					});
				}
				else{
					res.status(200).send({
						event:getEvent
					});
				}	
				
			}

		});		
}

function getEventsNoConcluidos(req,res)
{
	var event =new Event();//Creamos un nuevo usuario

	//Recogemos los parámetros (body) de la petición
	var params=req.body; //body parser se encarga de parsearlo a JSON


		//Añadimos un usuario si no existe ya antes
		//Este método devuelve vacío si no encuentra nada.
		Event.find({eventoConcluido:false}).sort({fechaFin:-1}).limit(10).populate({path:'autor'}).populate({path:'category',populate: { path:'tag'}}).populate({path:'fotos'}).exec((err, getEvent)=>{
			//Si hay error al comprobar el usuario.
			if(err){
				res.status(500).send({message: 'Error al comprobar si existe el evento. Error -->'+err});
			}
			else{
				if(!getEvent)
				{
					res.status(200).send({
						message:'No existe ningún evento.'
					});
				}
				else{
					res.status(200).send({
						event:getEvent
					});
				}	
				
			}

		});
			
}

function getLastEventNoConcluido(req,res)
{

		//Añadimos un usuario si no existe ya antes
		//Este método devuelve vacío si no encuentra nada.
		Event.findOne({eventoConcluido:false}).sort({fechaFin:-1}).limit(1).populate({path:'autor'}).populate({path:'category',populate: { path:'tag'}}).populate({path:'fotos'}).exec((err, getEvent)=>{
			//Si hay error al comprobar el usuario.
			if(err){
				res.status(500).send({message: 'Error al comprobar si existe el evento. Error -->'+err});
			}
			else{
				if(!getEvent)
				{
					res.status(200).send({
						message:'No existe ningún evento.'
					});
				}
				else{
					res.status(200).send({
						event:getEvent
					});
				}	
				
			}

		});		
			
}

function getLastEventConcluido(req,res)
{
	//Añadimos un usuario si no existe ya antes
		//Este método devuelve vacío si no encuentra nada.
		Event.findOne({eventoConcluido:true}).sort({fechaFin:-1}).limit(1).populate({path:'autor'}).populate({path:'category',populate: { path:'tag'}}).populate({path:'fotos'}).exec((err, getEvent)=>{
			//Si hay error al comprobar el usuario.
			if(err){
				res.status(500).send({message: 'Error al comprobar si existe el evento. Error -->'+err});
			}
			else{
				if(!getEvent)
				{
					res.status(200).send({
						message:'No existe ningún evento.'
					});
				}
				else{
					res.status(200).send({
						event:getEvent
					});
				}	
				
			}

		});		

}

function getEventById(req,res)
{
	var event =new Event();//Creamos un nuevo usuario

	//Recogemos los parámetros (body) de la petición
	var eventId=req.body._id;//body parser se encarga de parsearlo a JSON

	//Asignar valores al objeto Post
	if(eventId)
	{
		
		//Añadimos un usuario si no existe ya antes
		//Este método devuelve vacío si no encuentra nada.
		Event.findOne({_id:eventId}).populate({path:'autor'}).populate({path:'category',populate: { path:'tag'}}).exec((err, getEvent)=>{
			//Si hay error al comprobar el usuario.
			if(err){
				res.status(500).send({message: 'Error al comprobar si existe el Evento. Error -->'+err});
			}
			else{
				if(!getEvent)
				{
					res.status(404).send({
						message:'No existe ningún Evento con ese ID.'
					});
				}
				else{
					res.status(200).send({
						event:getEvent
					});
				}	
				
			}

		});
			
	}else{
		res.status(404).send({
			message:'Introduce los datos correctamente'
		});
	}
}


function updateEvent(req, res)
{
	var eventId = req.params.id; //Variable que recogemos por la URL
	var update = req.body;

	Event.findByIdAndUpdate(eventId,update,{new:true},(err,eventUpdated)=>{
		if(err)
		{
			res.status(500).send({
				message:'Error al actualizar el evento'
			});	
		}
		else{
			if(!eventUpdated){
				res.status(404).send({
					message:'No se ha podido actualizar el evento'
				});
			}else{
				res.status(200).send({
					event: eventUpdated
				});
			}
		}
	});
}

//Obtener una imagen del servidor
function getCountEvent(req,res)
{
	Event.count().exec(function(err,count){
		if(err){
				res.status(500).send({message: 'Error al contar los events. Error-->'+err});
		}
		else{//Si no hay error al contar los posts
				if(!count)//Si no existe el count.
				{
					res.status(200).send({
						message:'No se han podido contar el número de events almacenados en total.'
					});
				}
				else{
						res.status(200).send({count:count});
				}

		}//fin else count
	});
}


module.exports={
	pruebas,
	saveEvent,
	deleteEvent,
	updateEvent,
	getEvents,
	getEventById,
	getEventsConcluidos,
	getEventsNoConcluidos,
	getLastEventConcluido,
	getLastEventNoConcluido,
	getCountEvent
};