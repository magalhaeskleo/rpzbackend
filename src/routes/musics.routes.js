const express = require('express');
const routes = express.Router();

// const authMiddlewares = require('../app/middlewares/auth');

const RequestMusic = require('../app/controllers/MusicController');

// routes.use(authMiddlewares);
routes.post('/requestMusic', RequestMusic.add);
routes.delete('/requestMusic/:id', RequestMusic.delete);
routes.get('/requestMusic/:id', RequestMusic.index);
routes.get('/requestMusic', RequestMusic.all);
routes.get('/requestMusic/allForUser/:id', RequestMusic.allForUser);

module.exports = routes;
