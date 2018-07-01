'use strict'

var jwt=require('jwt-simple');
//Libreria para trabajar con timestamp, fechas...
var moment = require('moment');
var claveSecreta= 'clave_secreta_de_luismiguel';

exports.createToken= function(user){
	//Objeto con el que jwt creara el token
	var payload={
		sub: user._id,
		name:user.name,
		email:user.email,
		password:user.password,
		role:user.role,
		newsletter:user.newsletter,

		iat:moment().unix(),//timestamp actual
		exp:moment().add(14,"days").unix()//Tiempo de expiracion 2 dias en unix.

	};

	return jwt.encode(payload, claveSecreta);
};