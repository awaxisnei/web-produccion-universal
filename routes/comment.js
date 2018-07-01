'user strict'

var express=require('express');
var commentController=require('../controllers/comment');

var api=express.Router();

//Cargamos Middlewares
var mdAuth=require('../middlewares/authenticated');
var mdAdmin=require('../middlewares/is_admin');


//Métodos GET
//Métodos protegidos. Primero la ruta, luego el middelware y después el método a ejecutar.
api.get('/pruebas-comment', commentController.pruebas);
api.get('/get-comments', mdAuth.ensureAuth,commentController.getComments);

//Métodos POST
api.post('/save-comment', mdAuth.ensureAuth, commentController.saveComment);//Tienes que ser admin para añadir tags
api.post('/get-comments-by-user', mdAuth.ensureAuth,commentController.getCommentsByUser);
api.post('/get-comments-by-post', mdAuth.ensureAuth,commentController.getCommentsByPost);


//Métodos DELETE
api.delete('/delete-comment/:id', mdAuth.ensureAuth, commentController.deleteComment);


module.exports=api;