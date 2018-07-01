'user strict'

var express=require('express');
var eventController=require('../controllers/event');

var multipart=require('connect-multiparty');//Librería para manejar archivos

var api=express.Router();

//Cargamos Middlewares
var mdAuth=require('../middlewares/authenticated');
var mdAdmin=require('../middlewares/is_admin');

//Métodos GET
//Métodos protegidos. Primero la ruta, luego el middelware y después el método a ejecutar.
api.get('/pruebas-evento', eventController.pruebas);
api.get('/get-events',eventController.getEvents);
api.get('/get-events-concluidos',eventController.getEventsConcluidos);
api.get('/get-events-no-concluidos',eventController.getEventsNoConcluidos);
api.get('/get-last-event-no-concluido',eventController.getLastEventNoConcluido);
api.get('/get-last-event-concluido',eventController.getLastEventConcluido);
api.get('/get-count-event',eventController.getCountEvent);

//Métodos PUT
api.put('/update-event/:id',eventController.updateEvent);

//Métodos POST
api.post('/save-event', eventController.saveEvent);//Tienes que ser admin para añadir tags
api.post('/get-event-by-id',eventController.getEventById);

//Métodos DELETE
api.delete('/delete-event/:id', mdAuth.ensureAuth, eventController.deleteEvent);

module.exports=api;