'user strict'

var express=require('express');
var tagController=require('../controllers/tag');

var api=express.Router();

//Cargamos Middlewares
var mdAuth=require('../middlewares/authenticated');
var mdAdmin=require('../middlewares/is_admin');


//Métodos GET
//Métodos protegidos. Primero la ruta, luego el middelware y después el método a ejecutar.
api.get('/pruebas-tag', tagController.pruebas);
api.get('/get-tags',tagController.getTags);

//Métodos POST
api.post('/save-tag', mdAuth.ensureAuth, tagController.saveTag);//Tienes que ser admin para añadir tags
api.post('/get-tag-by-name',tagController.getTagByName);

//Métodos DELETE
api.delete('/delete-tag/:id', mdAuth.ensureAuth, tagController.deleteTag);


module.exports=api;