'user strict'

//Cargar modelos
var Photo=require('../models/photo');

var fs=require('fs'); // Para trabajar con el sistema de ficheros de nodejs

var path=require('path'); // Acceder a rutas de nuestro sistema de archivos.

//Funciones GET*****************
function pruebas(req,res)
{
	res.status(200).send({
		message: 'Probando el controlador para una foto'
	});
}

//Subir una imagen al servidor
function uploadImagePost(req,res)
{
	var filer_name='No subido...';

    var foto=new Photo();
    //Recogemos los parámetros (body) de la petición
	var params=req.body; //body parser se encarga de parsearlo a JSON

	if(req.files.file)//si hay archivos en la petición
	{
		//console.log(req.files);
		//Sacamos el nombre del fichero
		var file_path= req.files.file.path;
		var file_split= file_path.split('//');
		var file_name=file_split[2];

		//console.log(req.headers.host);
		var serverNode=req.headers.host; //Direccion de nodejs
		
		//Obtenemos la extension del fichero
		var ext_split=file_name.split('\.');
		var file_ext=ext_split[1].toLowerCase();
		var file_size=req.files.file.size;


		if(file_ext=='png' || file_ext=='jpg' || file_ext=='jpeg' || file_ext=='gif')
		{
			foto.name=file_name;
			foto.extension=file_ext;
			foto.size=file_size
			foto.descripcion=params.description;
			foto.link='http://'+serverNode+'/post/'+file_name;

			foto.save((err,fotoStored)=>{
							if(err)
							{
								res.status(500).send({message: 'Error al guardar la foto. Error -->'+err});
							}else{
								if(!fotoStored)
								{
									res.status(404).send({message:'No se ha ha guardado la foto'});
								}else{
									res.status(200).send({link:foto.link, foto:fotoStored})
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
		
		res.status(200).send({message: 'No se ha subido ningún archivo'});		
	}
}

//Subir una imagen al servidor
function uploadImageEvent(req,res)
{
	var filer_name='No subido...';

    var foto=new Photo();
    //Recogemos los parámetros (body) de la petición
	var params=req.body; //body parser se encarga de parsearlo a JSON

	if(req.files.file)//si hay archivos en la petición
	{
		//console.log(req.files);
		//Sacamos el nombre del fichero
		var file_path= req.files.file.path;
		var file_split= file_path.split('//');
		var file_name=file_split[2];

		//Obtenemos la extension del fichero
		var ext_split=file_name.split('\.');
		var file_ext=ext_split[1].toLowerCase();
		var file_size=req.files.file.size;

		//console.log(req.headers.host);
		var serverNode=req.headers.host; //Direccion de nodejs

		if(file_ext=='png' || file_ext=='jpg' || file_ext=='jpeg' || file_ext=='gif')
		{
			foto.name=file_name;
			foto.extension=file_ext;
			foto.size=file_size
			foto.descripcion=params.description;
			foto.link='http://'+serverNode+'/event/'+file_name;

			foto.save((err,fotoStored)=>{
							if(err)
							{
								res.status(500).send({message: 'Error al guardar la foto. Error -->'+err});
							}else{
								if(!fotoStored)
								{
									res.status(404).send({message:'No se ha ha guardado la foto'});
								}else{
									res.status(200).send({link:foto.link, foto:fotoStored})
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
		
		res.status(200).send({message: 'No se ha subido ningún archivo'});		
	}
}



//Obtener una imagen del servidor
function getImageFilePost(req,res)
{

	var imageFile = req.params.imageFile;
	var path_file = './uploads/post/'+imageFile;

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


//Subir una imagen al servidor
function uploadImageUser(req,res)
{
	res.status(200).send({message: 'Falta hacer este metodo...'});	
	//Falta hacer este método para el usuario
}

function getFotos(req,res)
{
	//Añadimos un usuario si no existe ya antes
		Photo.find({}, (err, getFotos)=>{
			//Si hay error al comprobar el usuario.
			if(err){
				res.status(500).send({message: 'Error al devolver las fotos existentes en la base de datos. Error -->'+err});
			}
			else{
				res.status(404).send({
						foto:getFotos
					});
			}

		});
}

function getFotoById(req,res)
{

	//Recogemos los parámetros (body) de la petición
	var fotoId=req.body._id;//body parser se encarga de parsearlo a JSON
	//Añadimos un usuario si no existe ya antes
		Photo.findOne({_id:fotoId}, (err, getFoto)=>{
			//Si hay error al comprobar el usuario.
			if(err){
				res.status(500).send({message: 'Error al devolver las fotos existentes en la base de datos. Error -->'+err});
			}
			else{
				if(!getFoto)
				{
					res.status(404).send({
						message:'No existe ninguna foto con ese ID.'
					});
				}
				else{
					res.status(200).send({
						foto:getFoto
					});
				}	
			}

		});
}

//Elimina el archivo fisico de la foto y el documento de la base de datos.
function deletePhotoPost(req,res)
{
	var pathFoto= req.body.link;
	var file_path= pathFoto;
	var file_split= file_path.split('/');
	var file_name=file_split[4];

	Photo.findOne({name: file_name}, (err, fotoFind)=>{
		if(err)
		{
			res.status(500).send({message:'Error al intentar buscar la foto deseada para eliminarla.'});
		}
		else{
			if(!fotoFind)
			{
				res.status(500).send({message:'No existe el nombre de la foto a eliminar. No se puede borrar ninguna foto.'});
			}
			else{

				//Eliminamos la foto en la base de datos.
				Photo.findByIdAndRemove(fotoFind._id, (err, fotoRemoved) =>{
					if(err){
						res.status(500).send({message:'Error al intentar eliminar la foto'});
					}else{
						if(!fotoRemoved)
						{
							res.status(500).send({message:'No existe el ID de la foto a eliminar. No se ha borrado ninguna foto.'});
						}
						else{
								

				            //Eliminamos fisicamente la foto en el servidor.
				            var path_file = './public/post/'+file_name;
				            var ruta=path.resolve(path_file);
				            //console.log(ruta);

				            fs.exists(path_file,function(exists){
								if(exists){
									//Objeto path para acceder a rutas de nuestro sistema de archivos. Me devolverá el archivo
									//Se elimina la foto fisica
									fs.unlink(ruta, (err)=>{
										if(err){

											res.status(500).send({message: 'Ha ocurrido un problema al borrar la foto.'});		
										}else{
											res.status(200).send({foto: fotoRemoved});		
										}
									});

								}
								else{
									res.status(404).send({
										message: 'La imagen no existe'
									});
								}
							});
							
						}
					}
				});
			}
		}
	});	

}

//Elimina el archivo fisico de la foto y el documento de la base de datos.
function deletePhotoEvent(req,res)
{
	var pathFoto= req.body.link;
	var file_path= pathFoto;
	var file_split= file_path.split('/');
	var file_name=file_split[4];

	Photo.findOne({name: file_name}, (err, fotoFind)=>{
		if(err)
		{
			res.status(500).send({message:'Error al intentar buscar la foto deseada para eliminarla.'});
		}
		else{
			if(!fotoFind)
			{
				res.status(500).send({message:'No existe el nombre de la foto a eliminar. No se puede borrar ninguna foto.'});
			}
			else{

				//Eliminamos la foto en la base de datos.
				Photo.findByIdAndRemove(fotoFind._id, (err, fotoRemoved) =>{
					if(err){
						res.status(500).send({message:'Error al intentar eliminar la foto'});
					}else{
						if(!fotoRemoved)
						{
							res.status(500).send({message:'No existe el ID de la foto a eliminar. No se ha borrado ninguna foto.'});
						}
						else{
								

				            //Eliminamos fisicamente la foto en el servidor.
				            var path_file = './public/event/'+file_name;
				            var ruta=path.resolve(path_file);
				            //console.log(ruta);

				            fs.exists(path_file,function(exists){
								if(exists){
									//Objeto path para acceder a rutas de nuestro sistema de archivos. Me devolverá el archivo
									//Se elimina la foto fisica
									fs.unlink(ruta, (err)=>{
										if(err){

											res.status(500).send({message: 'Ha ocurrido un problema al borrar la foto.'});		
										}else{
											res.status(200).send({foto: fotoRemoved});		
										}
									});

								}
								else{
									res.status(404).send({
										message: 'La imagen no existe'
									});
								}
							});
							
						}
					}
				});
			}
		}
	});	

}


module.exports={
	pruebas,
	uploadImagePost,
	uploadImageEvent,
	deletePhotoPost,
	deletePhotoEvent,
	getFotos,
	getFotoById,
	getImageFilePost

};
