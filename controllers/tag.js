'user strict'

//Cargar modelos
var Tag=require('../models/tag');

var Category=require('../models/category');


//Funciones GET*****************
function pruebas(req,res)
{
	res.status(200).send({
		message: 'Probando el controlador para un tag'
	});
}


//Guardar Tags
function saveTag(req,res)
{

	var tag =new Tag();//Creamos un nuevo Tag

	//Recogemos los parámetros (body) de la petición
	var params=req.body; //body parser se encarga de parsearlo a JSON

	//Asignar valores al objeto User
	if(params.name)
	{
	
		tag.name=params.name.toLowerCase();//Siempre se guardara en minuscula

		//Añadimos un usuario si no existe ya antes
		Tag.findOne({name: tag.name}, (err, newTag)=>{
			//Si hay error al comprobar el usuario.
			if(err){
				res.status(500).send({message: 'Error al comprobar si existe el Tag. Error -->'+err});
			}
			else{
				//Si no existe el nuevo tag a insertar, puedo añadirlo a la BD
				if(!newTag){
							
						tag.save((err,tagStored)=>{
							if(err)
							{
								res.status(500).send({message: 'Error al guardar el Tag. Error -->'+err});
							}else{
								if(!tagStored)
								{
									res.status(404).send({message:'No se ha ha registrado el Tag'});
								}else{
									res.status(200).send({tag: tagStored})
								}
							}
						});

				}
				else{
					res.status(404).send({
						message:'Tag no añadido. Ya existe en la base de datos.'
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

function getTags(req,res){
	//Añadimos un usuario si no existe ya antes
		Tag.find({}, (err, getTags)=>{
			//Si hay error al comprobar el usuario.
			if(err){
				res.status(500).send({message: 'Error al devolver los tags existentes en la base de datos. Error -->'+err});
			}
			else{
				res.status(200).send({
						tag:getTags
					});
			}

		});

}

//Obtiene todos los roles existentes en la base de datos
function getTagByName(req,res){
	
	var tag =new Tag();//Creamos un nuevo usuario

	//Recogemos los parámetros (body) de la petición
	var params=req.body; //body parser se encarga de parsearlo a JSON

	//Asignar valores al objeto Role
	if(params.name)
	{
	
		//Añadimos un usuario si no existe ya antes
		//Este método devuelve vacío si no encuentra nada.
		Tag.findOne({name: params.name.toLowerCase()}, (err, getTag)=>{
			//Si hay error al comprobar el usuario.
			if(err){
				res.status(500).send({message: 'Error al comprobar si existe el Tag. Error -->'+err});
			}
			else{
				if(!getTag)
				{
					res.status(404).send({
						message:'No existe ningún tag con ese nombre'
					});
				}
				else{
					res.status(404).send({
						tag:getTag
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

function deleteTag(req,res){
	var tagId=req.params.id;

	//Eliminamos esa tag que está asignada en categorías.
	Category.find({tag:tagId}, (err, tagRemoved) =>{
		if(err){
			res.status(500).send({message:'Error al intentar eliminar el tag'});
		}else{
			if(!tagRemoved)
			{
				res.status(500).send({message:'No existe el ID del tag a eliminar. No se ha borrado ningún tag.'});
			}
			else{
				//res.status(200).send({tag: tagRemoved});
				for(let i=0;i<tagRemoved.length;i++)
				{
					//Eliminamos el tag de cada subdocumento.
					tagRemoved[i].tag.pull(tagId);
					//Id de la categoría a actualizar
					var idCat =tagRemoved[i]._id;
					//Categoria para actualizar. Ya no aparece la etiqueta
					var cat=tagRemoved[i];

					//
					Category.findByIdAndUpdate(idCat,tagRemoved[i],{new:true},(err,catUpdated)=>{
						if(err)
						{
							res.status(500).send({
								message:'Error al eliminar las referencias de la etiqueta en la categoria'
							});	
						}
						else{
							if(!catUpdated){
								res.status(404).send({
									message:'Error al eliminar las referencias de la etiqueta en la categoria'
								});
							}else{
								//console.log('Categoria actualizada');
							}
						}
					});
				}		
				
			}


		}
	});


	//Eliminamos el tag en la colección Tags
	Tag.findByIdAndRemove(tagId, (err, tagRemoved) =>{
		if(err){
			res.status(500).send({message:'Error al intentar eliminar el tag'});
		}else{
			if(!tagRemoved)
			{
				res.status(500).send({message:'No existe el ID del tag a eliminar. No se ha borrado ningún tag.'});
			}
			else{
				res.status(200).send({tag: tagRemoved});
				console.log('Tag borrada en doc tag'+tagRemoved);
			}
		}
	});	

	


}




module.exports={
	pruebas,
	saveTag,
	getTags,
	getTagByName,
	deleteTag

};