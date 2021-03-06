const express = require('express');
const routes = express.Router();

const Show = require('../app/controllers/ShowController');

routes.get('/show/all', Show.all);
routes.get('/show/allAfterNow', Show.allAfterNow);
routes.get('/show/allAfterNowSimple', Show.allAfterNowSimple);
routes.post('/show', Show.add);
routes.get('/show/:id', Show.index);
routes.delete('/show/delete/:id', Show.delete);

module.exports = routes;
