'user strict'

//Cargar modelos
var Category=require('../models/category');

//Funciones GET*****************
function pruebas(req,res)
{
	res.status(200).send({
		message: 'Probando el controlador para una categoria'
	});
}

//Guardar Categorías
function saveCategory(req,res)
{

	var cat =new Category();

	//Recogemos los parámetros (body) de la petición
	var params=req.body; //body parser se encarga de parsearlo a JSON
	
	if(params.tag)
	{
		//Ordenamos el array
		var index=params.tag.sort();
		cat.tag=params.tag;
	}
	//Falta comprobar si hay etiquetas repetidas...

	//Asignar valores al objeto User
	if(params.name)
	{
		
	
		cat.name=params.name.toLowerCase();//Siempre se guardara en minuscula
		cat.description=params.description;
		

		//Añadimos un usuario si no existe ya antes
		Category.findOne({name: cat.name}, (err, newCat)=>{
			//Si hay error al comprobar el usuario.
			if(err){
				res.status(500).send({message: 'Error al comprobar si existe la categoría. Error -->'+err});
			}
			else{
				//Si no existe el nuevo tag a insertar, puedo añadirlo a la BD

				if(!newCat){
							
						cat.save((err,catStored)=>{
							if(err)
							{
								res.status(500).send({message: 'Error al guardar la categoría. Error -->'+err});
							}else{
								if(!catStored)
								{
									res.status(404).send({message:'No se ha ha registrado la categoría'});
								}else{
									res.status(200).send({Category: catStored})
								}
							}
						});

				}
				else{
					res.status(404).send({
						message:'Categoría no añadida. Ya existe en la base de datos.'
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


function getCategories(req,res){
	

	//Recogemos los parámetros (body) de la petición
	var params=req.body; //body parser se encarga de parsearlo a JSON


		//Añadimos un usuario si no existe ya antes
		//Este método devuelve vacío si no encuentra nada.
		Category.find({}).populate({path:'tag'}).exec((err, getCategories)=>{
			//Si hay error al comprobar el usuario.
			if(err){
				res.status(500).send({message: 'Error al comprobar si existe la categoría. Error -->'+err});
			}
			else{
				if(!getCategories)
				{
					res.status(404).send({
						message:'No existe ninguna categoría'
					});
				}
				else{
					res.status(200).send({
						categories:getCategories
					});

				}	
				
			}

		});

}


function getCategoryById(req,res)
{
	var category =new Category();//Creamos un nuevo usuario
	var categoryId=req.body._id;

	if(categoryId)
	{
		
		Category.findOne({_id: categoryId}).populate({path:'tag'}).exec((err, getCategory)=>{
			//Si hay error al comprobar el usuario.
			if(err){
				res.status(500).send({message: 'Error al comprobar si existe la Categoría. Error -->'+err});
			}
			else{
				if(!getCategory)
				{
					res.status(404).send({
						message:'No existe ninguna categoría con ese identificador.'
					});
				}
				else{
					res.status(200).send({
						category:getCategory
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


function getCategoryByName(req,res){
	
	var cat =new Category();//Creamos un nuevo usuario

	//Recogemos los parámetros (body) de la petición
	var params=req.body; //body parser se encarga de parsearlo a JSON


	//Asignar valores al objeto Role
	if(params.name)
	{
	
		
		//Este método devuelve vacío si no encuentra nada.
		Category.findOne({name: params.name.toLowerCase()}, (err, getCategory)=>{
			//Si hay error al comprobar el usuario.
			if(err){
				res.status(500).send({message: 'Error al comprobar si existe el Tag. Error -->'+err});
			}
			else{
				if(!getCategory)
				{
					res.status(404).send({
						message:'No existe ninguna categoría con ese nombre'
					});
				}
				else{
					res.status(404).send({
						category:getCategory
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


function deleteCategory(req,res){
	var categoryId=req.params.id;

	Category.findByIdAndRemove(categoryId, (err, categoryRemoved) =>{
		if(err){
			res.status(500).send({message:'Error al intentar eliminar la categoría'});
		}else{
			if(!categoryRemoved)
			{
				res.status(500).send({message:'No existe el ID de la categoría a eliminar. No se ha borrado ninguna categoría.'});
			}
			else{
				res.status(200).send({category: categoryRemoved});
			}
		}
	});
}

function updateCategory(req, res)
{
	var catId = req.params.id; //Variable que recogemos por la URL
	var update = req.body;

	Category.findByIdAndUpdate(catId,update,{new:true},(err,catUpdated)=>{
		if(err)
		{
			res.status(500).send({
				message:'Error al actualizar la categoria'
			});	
		}
		else{
			if(!catUpdated){
				res.status(404).send({
					message:'No se ha podido actualizar la categoria'
				});
			}else{
				res.status(200).send({
					category: catUpdated
				});
			}
		}
	});
	
}



module.exports={
	pruebas,
	saveCategory,
	getCategories,
	getCategoryByName,
	getCategoryById,
	updateCategory,
	deleteCategory

};
