'use strict'

exports.isAdmin = function (req,res,next){

	console.log(req.user);
	
	if(req.user.role != 'SuperAdmin')
	{	
		return res.status(200).send({message:'No tienes acceso al método. No eres administrador.'});
	}

			
	next();
};