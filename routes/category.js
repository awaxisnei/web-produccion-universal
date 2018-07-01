'user strict'

var express=require('express');
var categoryController=require('../controllers/category');

var api=express.Router();

//Cargamos Middlewares
var mdAuth=require('../middlewares/authenticated');
var mdAdmin=require('../middlewares/is_admin');


//Métodos GET
//Métodos protegidos. Primero la ruta, luego el middelware y después el método a ejecutar.
api.get('/pruebas-category', categoryController.pruebas);
api.get('/get-categories',categoryController.getCategories);


//Métodos POST
api.post('/save-category', categoryController.saveCategory);//Tienes que ser admin para añadir tags
api.post('/get-category-by-name',categoryController.getCategoryByName);
api.post('/get-category-by-id',categoryController.getCategoryById);

//Métodos PUT
api.put('/update-category/:id',mdAuth.ensureAuth,categoryController.updateCategory);

//Métodos DELETE
api.delete('/delete-category/:id', mdAuth.ensureAuth, categoryController.deleteCategory);


module.exports=api;