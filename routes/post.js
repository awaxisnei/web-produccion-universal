'user strict'

var express=require('express');
var postController=require('../controllers/post');

var api=express.Router();
var multipart=require('connect-multiparty');//Librería para manejar archivos

//Cargamos Middlewares
var mdAuth=require('../middlewares/authenticated');
var mdAdmin=require('../middlewares/is_admin');

var mdUpload=multipart({uploadDir:'./uploads/posts'});//Este es el directorio donde se guardarán los archivos


//Métodos GET
//Métodos protegidos. Primero la ruta, luego el middelware y después el método a ejecutar.
api.get('/pruebas-post', postController.pruebas);
api.get('/get-posts',postController.getPosts);
api.get('/get-count-post',postController.getCountPost);
api.get('/get-last-post',postController.getLastPost);
api.get('/get-image-file-post/:imageFile',postController.getImageFile);

//Métodos POST
api.post('/save-post', postController.savePost);//Tienes que ser admin para añadir tags
api.post('/get-post-by-author',postController.getPostByAuthor);
api.post('/get-post-by-id',postController.getPostById);
api.post('/get-posts/:page',postController.getPostsPagination);
api.post('/upload-image-post/:id',[mdUpload],postController.uploadImagePost);//En la parte de middleware pasamos un array mdAuth y md_upload

//Métodos PUT
api.put('/update-post/:id',postController.updatePost);

//Métodos DELETE
api.delete('/delete-post/:id', mdAuth.ensureAuth, postController.deletePost);


module.exports=api;