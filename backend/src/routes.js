const express = require('express');


const routes = express.Router();
const ClassesController = require('./controllers/ClassesController');
const ConnectionController = require('./controllers/ConnectionController');


routes.get('/classes',ClassesController.index);
routes.post('/classes',ClassesController.create);

routes.post('/connections',ConnectionController.create);
routes.get('/connections',ConnectionController.index);

module.exports = routes;