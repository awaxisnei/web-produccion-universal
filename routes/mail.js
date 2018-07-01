'user strict'

var express=require('express');
var mailController=require('../controllers/mail.js');

var api=express.Router();


api.post('/emailContacto',mailController.sendMail);

//Métodos GET
api.get('/pruebas-mail', mailController.pruebas);

module.exports=api;
