'user strict'

var express=require('express');
var userController=require('../controllers/user');

var api=express.Router();
var multipart=require('connect-multiparty');//Librería para manejar archivos

//Cargamos Middlewares
var mdAuth=require('../middlewares/authenticated');
var mdAdmin=require('../middlewares/is_admin');

var mdUpload=multipart({uploadDir:'./uploads/users'});//Este es el directorio donde se guardarán los archivos


//Métodos GET
//Métodos protegidos. Primero la ruta, luego el middelware y después el método a ejecutar.
api.get('/pruebas-del-controlador',userController.pruebas);

api.get('/get-image-file/:imageFile',userController.getImageFile);
api.get('/get-users', [mdAuth.ensureAuth, mdAdmin.isAdmin],userController.getUsers);


//Métodos POST
api.post('/get-user',userController.getUser);
api.post('/exist-user',userController.existUser);
api.post('/save-user',userController.saveUser);
api.post('/login',userController.login);
api.post('/upload-image-user/:id',[mdAuth.ensureAuth,mdUpload],userController.uploadImage);//En la parte de middleware pasamos un array mdAuth y md_upload

//Métodos PUT
api.put('/update-user/:id',mdAuth.ensureAuth,userController.updateUser);//:id es el parámetro que pasaremos por las URL

//Métodos DELETE
api.delete('/delete-user/:id',mdAuth.ensureAuth,userController.deleteUser);

module.exports=api;