const express = require('express');
const routes = express.Router();
const multer = require('multer');
const multerConfig = require('../config/multer');
// const authMiddlewares = require('../app/middlewares/auth');

const File = require('../app/controllers/FileController');
// routes.use(authMiddlewares);

routes.post('/file', multer(multerConfig).single('file'), File.add);
routes.get('/file/all', File.all);
routes.get('/file/:id', File.index);
routes.delete('/file/:id', File.delete);

module.exports = routes;
