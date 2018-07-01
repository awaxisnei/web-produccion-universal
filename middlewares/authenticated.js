'use strict'

var jwt=require('jwt-simple');
var moment=require('moment');

var claveSecreta= 'clave_secreta_de_luismiguel';

//Cuando lanzemos la funcion next() podamos pasar al siguiente método...
exports.ensureAuth= function (req, res, next){

	//Comprobar si nos llega la cabecera de autenticacion
	if(!req.headers.authorization){
		return res.status(403).send({message:'La petición no tiene la cabecera de autenticación'});
	}


	var token= req.headers.authorization.replace(/['"]+/g,'');//Reemplazar comillas simples y dobles del token por nada. Por si acaso.
	//Si entra en el try es que el token es correcto. Si no, se iría al catch.
	try{
		//Aqui se va a decodificar el token
		var payload= jwt.decode(token, claveSecreta);

		//compruebo que la fecha de expiración sea correcta.
		if(payload.exp<=moment().unix())
		{
			return res.status(401).send({
				message:'El token ha expirado'
			});
		}
	}	
	catch(ex)
	{
		return res.status(404).send({
			message:'El token no es válido'
		});
	}


	req.user=payload; //Puedo guardar el payload en una variable user del request.
	//Este método es necesario para salir del middleware y pasar de método.
	next();	
};