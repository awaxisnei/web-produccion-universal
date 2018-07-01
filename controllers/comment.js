'user strict'

//Cargar modelos
var Comment=require('../models/comment');

//Funciones GET*****************
function pruebas(req,res)
{
	res.status(200).send({
		message: 'Probando el controlador para una comment'
	});
}

//Guardar Ccomentario
function saveComment(req,res)
{

	var comment =new Comment();

	//Recogemos los parámetros (body) de la petición
	var params=req.body; //body parser se encarga de parsearlo a JSON

	//Asignar valores al objeto User
	if(params.mensaje && params.user && params.post)
	{
	
		comment.user=params.user;//Siempre se guardara en minuscula
		comment.mensaje=params.mensaje;
		comment.post=params.post;
				
		comment.save((err,commentStored)=>{
		if(err)
		{
				res.status(500).send({message: 'Error al guardar el comentario. Error -->'+err});
		}else{
			if(!commentStored)
			{
					res.status(404).send({message:'No se ha añadido el comentario'});
			}else{

					//Añadimos el comentario al post
					res.status(200).send({Comment: commentStored})
				 }
			}
		});

			
	}else{
		res.status(404).send({
			message:'Introduce los datos correctamente'
		});
	}

}

function getComments(req,res){
	
	//Recogemos los parámetros (body) de la petición
	var params=req.body; //body parser se encarga de parsearlo a JSON


		//Añadimos un usuario si no existe ya antes
		//Este método devuelve vacío si no encuentra nada.
		Comment.find({}).populate({path:'user'}).populate({path:'post'}).exec((err, getComments)=>{
			//Si hay error al comprobar el usuario.
			if(err){
				res.status(500).send({message: 'Error al comprobar si existe el comentario. Error -->'+err});
			}
			else{
				if(!getComments)
				{
					res.status(404).send({
						message:'No existe ningún comentario'
					});
				}
				else{


					res.status(404).send({
						comments:getComments
					});
				}	
				
			}

		});

}

function getCommentsByPost(req,res)
{
	var comment =new Comment();//Creamos un nuevo usuario

	//Recogemos los parámetros (body) de la petición
	var params=req.body; //body parser se encarga de parsearlo a JSON

	//Asignar valores al objeto Post
	if(params.post)
	{
		
		//Añadimos un usuario si no existe ya antes
		//Este método devuelve vacío si no encuentra nada.
		Comment.find({post:params.post}).populate({path:'post'}).populate({path:'user'}).exec((err, getComments)=>{
			//Si hay error al comprobar el usuario.
			if(err){
				res.status(500).send({message: 'Error al comprobar si existe el Comentario de un post concreto. Error -->'+err});
			}
			else{
				if(!getComments)
				{
					res.status(404).send({
						message:'No existe ningún Comentario para ese post.'
					});
				}
				else{
					res.status(404).send({
						comments:getComments
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

function getCommentsByUser(req,res)
{
	var comment =new Comment();//Creamos un nuevo usuario

	//Recogemos los parámetros (body) de la petición
	var params=req.body; //body parser se encarga de parsearlo a JSON

	//Asignar valores al objeto Post
	if(params.user)
	{
		
		//Añadimos un usuario si no existe ya antes
		//Este método devuelve vacío si no encuentra nada.
		Comment.find({user:params.user}).populate({path:'post'}).populate({path:'user'}).exec((err, getComments)=>{
			//Si hay error al comprobar el usuario.
			if(err){
				res.status(500).send({message: 'Error al comprobar si existe el Comentario de un post concreto. Error -->'+err});
			}
			else{
				if(!getComments)
				{
					res.status(404).send({
						message:'No existe ningún Comentario para ese post.'
					});
				}
				else{
					res.status(404).send({
						comments:getComments
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

function deleteComment(req,res){
	var commentId=req.params.id;

	Comment.findByIdAndRemove(commentId, (err, commentRemoved) =>{
		if(err){
			res.status(500).send({message:'Error al intentar eliminar el comentario'});
		}else{
			if(!commentRemoved)
			{
				res.status(500).send({message:'No existe el ID del comentario a eliminar. No se ha borrado ningún comentario.'});
			}
			else{
				res.status(500).send({comment: commentRemoved});
			}
		}
	});
}

//FALTA DELETE

module.exports={
	pruebas,
	saveComment,
	getComments,
	getCommentsByPost,
	getCommentsByUser,
	deleteComment

};