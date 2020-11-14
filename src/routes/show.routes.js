const express = require('express');
const routes = express.Router();

const Show = require('../app/controllers/ShowController');

routes.get('/show/all', Show.all);
routes.get('/show/allAfterNow', Show.allAfterNow);
routes.post('/show', Show.add);
routes.get('/show/:id', Show.index);

module.exports = routes;
