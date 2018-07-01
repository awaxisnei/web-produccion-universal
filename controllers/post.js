'user strict'

var fs=require('fs'); // Para trabajar con el sistema de ficheros de nodejs

var path=require('path'); // Acceder a rutas de nuestro sistema de archivos.

//Cargar modelos
var Post=require('../models/post');
var Comment=require('../models/comment');

//Funciones GET*****************
function pruebas(req,res)
{
	res.status(200).send({
		message: 'Probando el controlador para un post'
	});
}


function savePost(req,res)
{

	var post =new Post();//Creamos un nuevo Tag

	//Recogemos los parámetros (body) de la petición
	var params=req.body; //body parser se encarga de parsearlo a JSON
	//console.log(params);
	//Asignar valores al objeto User
	if(params.mensaje && params.titulo && params.autor)
	{
	
		post.autor=params.autor;

		if(params.category!='')
		{
			post.category=params.category;
		}
		if(!params.fecha)
		{
			post.fecha=Date.now();
		}
		post.mensaje=params.mensaje;
		post.titulo=params.titulo;
		//post.comentario=[];
		post.fotos=params.fotos;

		if(!params.portada)
		{
			post.portada='NoPhoto.png';
		}
							
	    post.save((err,postStored)=>{
		if(err)
		{
			res.status(500).send({message: 'Error al guardar el Post. Error -->'+err});
			}else{
			    if(!postStored)
					{
						res.status(404).send({message:'No se ha ha registrado el Post'});
					}else{
							res.status(200).send({post: postStored})
						 }
				}
		});

				
			
	}else{
		res.status(200).send({
			message:'Introduce los datos correctamente'
		});
	}

}


function getPostByAuthor(req,res)
{
	var post =new Post();//Creamos un nuevo usuario

	//Recogemos los parámetros (body) de la petición
	var params=req.body; //body parser se encarga de parsearlo a JSON

	//Asignar valores al objeto Post
	if(params.autor)
	{
		
		//Añadimos un usuario si no existe ya antes
		//Este método devuelve vacío si no encuentra nada.
		Post.find({author:params.autor}).populate({path:'autor'}).populate({path:'category',populate: { path:'tag'}}).populate({path:'fotos'}).exec((err, getPost)=>{
			//Si hay error al comprobar el usuario.
			if(err){
				res.status(500).send({message: 'Error al comprobar si existe el Post de un usuario concreto. Error -->'+err});
			}
			else{
				if(!getPost)
				{
					res.status(404).send({
						message:'No existe ningún Post con ese nombre de autor.'
					});
				}
				else{
					res.status(404).send({
						post:getPost
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


function getPostById(req,res)
{
	var post =new Post();//Creamos un nuevo usuario
    var postId=req.body._id; //Parametro viene por el body.
	
	
	//Asignar valores al objeto Post
	if(postId)
	{
		
		//Añadimos un usuario si no existe ya antes
		//Este método devuelve vacío si no encuentra nada.
		Post.findOne({_id:postId}).populate({path:'autor'}).populate({path:'category',populate: { path:'tag'}}).exec((err, getPost)=>{
			//Si hay error al comprobar el usuario.
			if(err){
				res.status(500).send({message: 'Error al comprobar si existe el Post. Error -->'+err});
			}
			else{
				if(!getPost)
				{
					res.status(404).send({
						message:'No existe ningún Post con ese ID.'
					});
				}
				else{
					res.status(200).send({
						post:getPost
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




/*Populate de varios niveles*/
function getPosts(req,res)
{
	var post =new Post();//Creamos un nuevo usuario

	//Recogemos los parámetros (body) de la petición
	var params=req.body; //body parser se encarga de parsearlo a JSON


		//Añadimos un usuario si no existe ya antes
		//Este método devuelve vacío si no encuentra nada.
		Post.find({}).populate({path:'autor'}).populate({path:'category',populate: { path:'tag'}}).populate({path:'fotos'}).exec((err, getPost)=>{
			//Si hay error al comprobar el usuario.
			if(err){
				res.status(500).send({message: 'Error al comprobar si existe el Post de un usuario concreto. Error -->'+err});
			}
			else{
				if(!getPost)
				{
					res.status(200).send({
						message:'No existe ningún Post con ese nombre de autor.'
					});
				}
				else{
					res.status(200).send({
						post:getPost
					});
				}	
				
			}

		});		
}

/*Populate de varios niveles*/
function getPostsPagination(req,res)
{
	var post =new Post();//Creamos un nuevo post

	var perPage=Number(req.body.perPage);
	var page=req.params.page;

	//Recogemos los parámetros (body) de la petición
	var params=req.body; //body parser se encarga de parsearlo a JSON


		//Añadimos un usuario si no existe ya antes
		//Este método devuelve vacío si no encuentra nada.
		Post.find({}).skip(perPage*page).limit(perPage).sort({fecha:-1}).populate({path:'autor'}).populate({path:'category',populate: { path:'tag'}}).populate({path:'fotos'}).exec((err, getPost)=>{
			//Si hay error al comprobar el usuario.
			if(err){
				res.status(500).send({message: 'Error al comprobar si existe el Post de un usuario concreto. Error -->'+err});
			}
			else{
				if(!getPost)
				{
					res.status(200).send({
						message:'No existe ningún Post con ese nombre de autor.'
					});
				}
				else{//Si 
					Post.count().exec(function(err,count){
						if(err){
							res.status(500).send({message: 'Error al contar los posts. Error-->'+err});
						}
						else{//Si no hay error al contar los posts
							if(!count)//Si no existe el count.
							{
								res.status(200).send({
									message:'No se han podido contar el número de posts almacenados en total.'
								});
							}
							else{

								res.status(200).send({
									post:getPost,
									page:page,
									perPage:perPage,
									count:count
								});
							}

						}//fin else count
					});
						
				}	
				
			}

		});
			
}

function getLastPost(req,res)
{
		//Añadimos un usuario si no existe ya antes
		//Este método devuelve vacío si no encuentra nada.
		Post.findOne({}).limit(1).sort({fecha:-1}).populate({path:'autor'}).populate({path:'category',populate: { path:'tag'}}).populate({path:'fotos'}).exec((err, getPost)=>{
			//Si hay error al comprobar el usuario.
			if(err){
				res.status(500).send({message: 'Error al comprobar si existe el Post de un usuario concreto. Error -->'+err});
			}
			else{
				if(!getPost)
				{
					res.status(200).send({
						message:'No existe ningún Post.'
					});
				}
				else{//Si 
						res.status(200).send({
						post:getPost
					
						});
						
				}	
				
			}

		});
			
}

function deletePost(req,res){
	var postId=req.params.id;

	Post.findByIdAndRemove(postId, (err, postRemoved) =>{
		if(err){
			res.status(500).send({message:'Error al intentar eliminar el post'});
		}else{
			if(!postRemoved)
			{
				res.status(500).send({message:'No existe el ID del post a eliminar. No se ha borrado ningún post.'});
			}
			else{ //Se ha eliminado el post

				//Eliminar foto portada del servidor
				if(postRemoved.portada!="NoPhoto.png")
				{
					var path_file = './uploads/posts/'+postRemoved.portada;
			    	var file_path=path.resolve(path_file);
			    	fs.unlink(file_path, (err)=>{
						if(err){

							res.status(200).send({message: 'Ha ocurrido un problema al borrar la foto de portada  del post del servidor: -->'+err});		
						}
					});
		    	}

		    	//Fin eliminar foto portada servidor


				res.status(200).send({post: postRemoved});
			}
		}
	});
}

/*function updatePost(req, res)
{
	var postId = req.params.id; //Variable que recogemos por la URL
	var update = req.body;

	Post.findByIdAndUpdate(postId,update,{new:true},(err,postUpdated)=>{
		if(err)
		{
			res.status(500).send({
				message:'Error al actualizar el post'
			});	
		}
		else{
			if(!postUpdated){
				res.status(404).send({
					message:'No se ha podido actualizar el post'
				});
			}else{
				res.status(200).send({
					post: postUpdated
				});
			}
		}
	});
	
}*/

function updatePost(req, res)
{
	var postId = req.params.id; //Variable que recogemos por la URL
	var update = req.body;

	Post.findOne({_id: postId}, (err, postBuscado)=>{
			//Si hay error al comprobar el usuario.
		if(err){
			res.status(500).send({message: 'Error al comprobar el post para borrar la foto de portada del servidor. Error -->'+err});
		}else{
				var path_file = './uploads/posts/'+postBuscado.portada;
		    	var file_path=path.resolve(path_file);

		    	//Comprobamos si el post que buscamos tiene portada, y si la portada a actualizar es la misma que la que tiene
		    	if(postBuscado.portada && postBuscado.portada!=update.portada){
		    			//eLIMINAR FOTO DEL SERVIDOR
		    			fs.unlink(file_path, (err)=>{
						if(err){

							res.status(200).send({message: 'Ha ocurrido un problema al borrar la foto de perfil del servidor: -->'+err});		
						}else{
						//Fin eliminar foto del servidor

								//ACTUALIZAR POST
					    		Post.findByIdAndUpdate(postId,update,{new:true},(err,postUpdated)=>{
								if(err)
								{
									res.status(500).send({
										message:'Error al actualizar el post'
									});	
								}
								else{
									if(!postUpdated){
										res.status(404).send({
											message:'No se ha podido actualizar el post'
										});
									}else{
										res.status(200).send({
											post: postUpdated
										});
									}
								}
							});
					    	//FIN ACTUALIZAR POST
					    }
					 });

		    	}
		    	else{

		    			//ACTUALIZAR POST
			    		Post.findByIdAndUpdate(postId,update,{new:true},(err,postUpdated)=>{
							if(err)
							{
								res.status(500).send({
									message:'Error al actualizar el post'
								});	
							}
							else{
								if(!postUpdated){
									res.status(404).send({
										message:'No se ha podido actualizar el post'
									});
								}else{
									res.status(200).send({
										post: postUpdated
									});
								}
							}
						});
						//FIN AXCTUALIZAR POST
			    }
		}
	}); //FIN FindOne
	
}

//Subir una imagen al servidor
function uploadImagePost(req,res)
{
	var postId=req.params.id;
	var file_name='No subido...';


	if(req.files.portada)//si hay archivos en la petición
	{
		//console.log(req.files);
		//Sacamos el nombre del fichero
		var file_path= req.files.portada.path;
		var file_split= file_path.split('//');
		var file_name=file_split[2];

		//Obtenemos la extension del fichero
		var ext_split=file_name.split('\.');
		var file_ext=ext_split[1].toLowerCase();

		if(file_ext=='png' || file_ext=='jpg' || file_ext=='jpeg' || file_ext=='gif')
		{

			Post.findByIdAndUpdate(postId,{portada:file_name},{new:true},(err,postUpdated)=>{
				if(err)
				{
					res.status(500).send({
						message:'Error al actualizar la imagen de la portada del post'
					});	
				}
				else{
					if(!postUpdated){
						res.status(404).send({
							message:'No se ha podido actualizar la imagen de la portada del post'
						});
					}else{
						res.status(200).send({
							post: postUpdated,
							portada: file_name
						});

					   //Falta eliminar la imagen anterior al actualizar la imagen del usuario
					}
				}
			});
	

		}else{
			//Borramos el archivo si no es válido. Porque siempre se sube al servidor.
			fs.unlink(file_path, (err)=>{
				if(err){

					res.status(200).send({message: 'Ha ocurrido un problema al borrar el fichero. Extensión no válida.'});		
				}else{
					res.status(200).send({message: 'La extensión del archivo no es válida'});		
				}
			});
			
		}


		


	}
	else{//Si no hay archivos en la petición
		
		res.status(200).send({message: 'No se ha subido ningún archivo para la portada del post'});		
	}
}

//Obtener una imagen del servidor
function getImageFile(req,res)
{

	var imageFile = req.params.imageFile;
	if(imageFile)
	{
		var path_file = './uploads/posts/'+imageFile;
		//console.log(path_file);

		//fs. sistema de ficheros de nodejs
		fs.exists(path_file,function(exists){
			if(exists){
				//Objeto path para acceder a rutas de nuestro sistema de archivos. Me devolverá el archivo
				res.sendFile(path.resolve(path_file));
			}
			else{
				res.status(404).send({
					message: 'La imagen no existe'
				});
			}
		});
	}	
}

//Obtener una imagen del servidor
function getCountPost(req,res)
{
	Post.count().exec(function(err,count){
		if(err){
				res.status(500).send({message: 'Error al contar los posts. Error-->'+err});
		}
		else{//Si no hay error al contar los posts
				if(!count)//Si no existe el count.
				{
					res.status(200).send({
						message:'No se han podido contar el número de posts almacenados en total.'
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
	savePost,
	getPosts,
	getPostsPagination,
	getPostByAuthor,
	getPostById,
	getImageFile,
	getCountPost,
	getLastPost,
	updatePost,
	uploadImagePost,
	deletePost


};