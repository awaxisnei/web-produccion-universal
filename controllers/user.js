'user strict'

//Cargar modulos
var bcrypt=require('bcrypt-nodejs');
var fs=require('fs'); // Para trabajar con el sistema de ficheros de nodejs

var path=require('path'); // Acceder a rutas de nuestro sistema de archivos.
//Cargar modelos
var User=require('../models/user');

//Cargar servicios.
var jwt=require('../services/jwt');

var rutaUser='./uploads/users/';


//Funciones GET*****************
function pruebas(req,res)
{
	res.status(200).send({
		message: 'Probando el controlador para un user'
	});
}

//Funciones POST****************

//Guardar usuarios
function saveUser(req,res)
{

	var user =new User();//Creamos un nuevo usuario

	//Recogemos los parámetros (body) de la petición
	var params=req.body; //body parser se encarga de parsearlo a JSON

	//Asignar valores al objeto User
	if(params.password && params.name && params.email && params.user)
	{
	
		user.name=params.name;
		user.user=params.user;
		user.email=params.email;
		user.newsletter=params.newsletter;
		user.role=params.role; //Recibiremos un id de Role

		//Añadimos un usuario si no existe ya antes
		User.findOne({email: user.email.toLowerCase()}, (err, newUser)=>{
			//Si hay error al comprobar el usuario.
			if(err){
				res.status(500).send({message: 'Error al comprobar el usuario. Error -->'+err});
			}
			else{
				//Si no existe el nuevo usuario a insertar, puedo añadirlo a la BD
				if(!newUser){
							//Cifrar contraseña
					bcrypt.hash(params.password,null,null,function(err,hash){
						user.password=hash;
						//guardo usuario en base de datos

						user.save((err,userStored)=>{
							if(err)
							{
								res.status(500).send({message: 'Error al guardar el usuario. Error -->'+err});
							}else{
								if(!userStored)
								{
									res.status(404).send({message:'No se ha ha registrado el usuario'});
								}else{
									res.status(200).send({user: userStored})
								}
							}
						});
					});

				}
				else{
					res.status(404).send({
						message:'Usuario no añadido. Ya existe en la base de datos.'
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

//LOGIN
function login(req,res)
{

	//Recogemos los parámetros (body) de la petición
	var params=req.body; //body parser se encarga dare parsearlo a JSON

	var email=params.email;
	var password=params.password;
	//Añadimos un usuario si no existe ya antes
		User.findOne({email: email.toLowerCase()}, (err, userLogin)=>{
			//Si hay error al comprobar el usuario.
			if(err){
				res.status(500).send({message: 'Error al comprobar el usuario. Error -->'+err});
			}else{
				if(userLogin)
				{
					bcrypt.compare(password,userLogin.password,(err,check)=>{
						if(check)
						{
							//Comprobamos si la opción de token existe.
							if(params.getToken==true)
							{
								res.status(200).send({
									//Usamos el servicio de jwt y el método creado por nosotros. Le pasamos el usuario
									//devolvemos el token.
									token:jwt.createToken(userLogin)
								});

							}else{
								
								res.status(200).send({userLogin});	
							}
							
						}else{
							res.status(200).send({
								message:'El usuario no ha podido loguearse correctamente.'
							});
						}

					});
				}else{
						res.status(200).send({
							message:'El usuario no ha podido loguearse'
						});
				}

			}
		});

}

//MéTODOS PUT
function updateUser(req, res)
{
	var userId = req.params.id; //Variable que recogemos por la URL
	var update = req.body;
	
	//Eliminamos del objeto uusuario la contraseña para que no se actualice.
	//Normalmente este campo se actualiza en un método aparte
	delete update.password;


//req, user sub es el user logueado. Lo guardamos antes en el middleware autheticated
	if(userId != req.user.sub)
	{
		return res.status(500).send({
			message:'No tienes permiso para actualizar el usuario'
		});

	}

	/**ELIMINAR FOTO EN EL SERVIDOR antes de actualizar**/
	

	User.findOne({_id: userId}, (err, userBuscado)=>{
			//Si hay error al comprobar el usuario.
		if(err){
			res.status(500).send({message: 'Error al comprobar el usuario para borrar la foto de perfil del servidor. Error -->'+err});
		}else{

	
			var path_file = './uploads/users/'+userBuscado.image;
		    var file_path=path.resolve(path_file);

		    //Si el usuario tiene imagen, y si es la misma a la que se quiere actualizar.
			if(userBuscado.image){
				
					fs.unlink(file_path, (err)=>{
						if(err){

							res.status(200).send({message: 'Ha ocurrido un problema al borrar la foto de perfil del servidor: -->'+err});		
						}else{
							/**Fin eliminar foto del servidor**/

							//ACTUALIZAR USUARIO
							User.findByIdAndUpdate(userId,update,{new:true},(err,userUpdated)=>{
								if(err)
								{
									res.status(500).send({
										message:'Error al actualizar el usuario'
									});	
								}
								else{
									if(!userUpdated){
										res.status(404).send({
											message:'No se ha podido actualizar el usuario'
										});
									}else{
										res.status(200).send({
											user: userUpdated
										});
									}
								}
							});	
							//FIN ACTUALIZAR USER
						}
				
				 });
		

			}
			else{

				//ACTUALIZAR USUARIO
							User.findByIdAndUpdate(userId,update,{new:true},(err,userUpdated)=>{
								if(err)
								{
									res.status(500).send({
										message:'Error al actualizar el usuario'
									});	
								}
								else{
									if(!userUpdated){
										res.status(404).send({
											message:'No se ha podido actualizar el usuario'
										});
									}else{
										res.status(200).send({
											user: userUpdated
										});
									}
								}
							});	
			}
	    }
	
	});	
	
}



//Subir una imagen al servidor
function uploadImage(req,res)
{
	var userId=req.params.id;
	var filer_name='No subido...';

	//console.log(req.files);

	if(req.files.image)//si hay archivos en la petición
	{
		//console.log(req.files);
		//Sacamos el nombre del fichero
		var file_path= req.files.image.path;
		var file_split= file_path.split('//');
		var file_name=file_split[2];

		//Obtenemos la extension del fichero
		var ext_split=file_name.split('\.');
		var file_ext=ext_split[1].toLowerCase();

		if(file_ext=='png' || file_ext=='jpg' || file_ext=='jpeg' || file_ext=='gif')
		{
			//req, user sub es el user logueado. Lo guardamos antes en el middleware autheticated
			if(userId != req.user.sub)
			{
				return res.status(500).send({
					message:'No tienes permiso para subir una imagen'
				});

			}

			User.findByIdAndUpdate(userId,{image:file_name},{new:true},(err,userUpdated)=>{
				if(err)
				{
					res.status(500).send({
						message:'Error al actualizar la imagen del usuario'
					});	
				}
				else{
					if(!userUpdated){
						res.status(404).send({
							message:'No se ha podido actualizar la imagen del usuario'
						});
					}else{
						res.status(200).send({
							user: userUpdated,
							image: file_name
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
		
		res.status(200).send({message: 'No se ha subido ningún archivo para el usuario'});		
	}
}

//Obtener una imagen del servidor
function getImageFile(req,res)
{

	var imageFile = req.params.imageFile;
	if(imageFile)
	{
		var path_file = rutaUser+imageFile;

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

function deleteUser(req,res)
{
	var userId= req.params.id;

	User.findByIdAndRemove(userId, (err, userRemoved) =>{
		if(err){
			res.status(500).send({message:'Error al intentar eliminar el role'});
		}else{
			if(!userRemoved)
			{
				res.status(500).send({message:'No existe el ID del role a eliminar. No se ha borrado ningún role.'});
			}
			else{
				res.status(500).send({user: userRemoved});
			}
		}
	});

}

function getUsers(req,res)
{
	//Añadimos un usuario si no existe ya antes
		User.find({}, (err, getUsers)=>{
			//Si hay error al comprobar el usuario.
			if(err){
				res.status(500).send({message: 'Error al devolver los usuarios existentes en la base de datos. Error -->'+err});
			}
			else{
				res.status(200).send({
						user:getUsers
					});
			}

		});
}

function getUser(req,res)
{

	//Recogemos los parámetros (body) de la petición
	var params=req.body; //body parser se encarga dare parsearlo a JSON
	var email=params.email;

	//Asignar valores al objeto User
	if(email)
	{
		//Añadimos un usuario si no existe ya antes
			User.find({email:email}, (err, getUser)=>{
				//Si hay error al comprobar el usuario.
				if(err){
					res.status(500).send({message: 'Error al devolver el usuario. Error -->'+err});
				}
				else{
					res.status(200).send({
							user:getUser
						});
				}

			});
	}else{
			res.status(404).send({
						message: 'Introduce los datos correctamente'
			});
	}
}

function existUser(req,res)
{
	//Recogemos los parámetros (body) de la petición
	var params=req.body; //body parser se encarga dare parsearlo a JSON
	var email=params.email;

	//Asignar valores al objeto User
	if(email)
	{
		//Añadimos un usuario si no existe ya antes
			User.find({email:email}, (err, getUser)=>{
				//Si hay error al comprobar el usuario.
				if(err){
					res.status(500).send({message: 'Error al devolver el usuario. Error -->'+err});
				}
				else{

					if(getUser.length!=0)
					{
						res.status(200).send({
							user:true
						});
					}
					else{
						res.status(200).send({
							user:false
						});
					}
					
				}

			});
	}else{
			res.status(404).send({
						message: 'Introduce los datos correctamente'
			});
	}
}



module.exports={
	pruebas, //Si hubiera más métodos se separan por ,
	saveUser,
	login,
	updateUser,
	uploadImage,
	getImageFile,
	deleteUser,
	getUsers,
	getUser,
	existUser

};