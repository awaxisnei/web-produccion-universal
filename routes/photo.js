'user strict'

var express=require('express');
var photoController=require('../controllers/photo');

var multipart=require('connect-multiparty');//Librería para manejar archivos

var api=express.Router();

//Cargamos Middlewares
var mdAuth=require('../middlewares/authenticated');
var mdAdmin=require('../middlewares/is_admin');

var mdUploadPost=multipart({uploadDir:'./public/post'});//Este es el directorio donde se guardarán los archivos
var mdUploadEvent=multipart({uploadDir:'./public/event'});//Este es el directorio donde se guardarán los archivos

var mdUploadUser=multipart({uploadDir:'./uploads/user'});//Este es el directorio donde se guardarán los archivos


//Métodos GET
//Métodos protegidos. Primero la ruta, luego el middelware y después el método a ejecutar.
api.get('/pruebas-photo', photoController.pruebas);
api.get('/get-fotos', [mdAuth.ensureAuth],photoController.getFotos);
api.get('/get-image-post/:imageFile',photoController.getImageFilePost);

//POST
api.post('/upload-image-post',[mdUploadPost],photoController.uploadImagePost);//En la parte de middleware pasamos un array mdAuth y md_upload
api.post('/upload-image-event',[mdUploadEvent],photoController.uploadImageEvent);//En la parte de middleware pasamos un array mdAuth y md_upload
api.post('/delete-foto-event/',photoController.deletePhotoEvent);
api.post('/delete-foto-post/',photoController.deletePhotoPost);
api.post('/get-foto-by-id', [mdAuth.ensureAuth],photoController.getFotoById);
//api.post('/upload-image-user',[mdUploadUser,mdAuth.ensureAuth],photoController.uploadImageUser);


//DELETE
//Métodos DELETE
//api.delete('/delete-foto/:id',mdAuth.ensureAuth,photoController.deletePhoto);

module.exports=api;