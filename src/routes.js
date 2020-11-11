const express = require('express');
const routes = express.Router();
const multer = require('multer');
const multerConfig = require('./config/multer');

const File = require('./controllers/FileController');
const Show = require('./controllers/ShowController');
const Register = require('./controllers/RegisterController');

const RequestMusic = require('./controllers/MusicController');
const NameForList = require('./controllers/NameListController');

routes.post('/file', multer(multerConfig).single('file'), File.add);
routes.get('/file/all', File.all);
routes.get('/file/:id', File.index);
routes.delete('/file/:id', File.delete);

routes.get('/show/all', Show.all);
routes.get('/show/allAfterNow', Show.allAfterNow);
routes.post('/show', Show.add);
routes.get('/show/:id', Show.index);

routes.post('/register', Register.add);
routes.get('/register/all', Register.all);
routes.get('/register/:id', Register.index);
routes.delete('/register/:id', Register.delete);
routes.put('/register/:id', Register.upDate);

routes.post('/login/', Register.login);
routes.post('/loginConfirm', Register.loginConfirm);

routes.post('/nameForList', NameForList.add);
routes.get('/nameForList/allForUser/:id', NameForList.allForUser);
routes.get('/nameForList', NameForList.all);

routes.post('/requestMusic', RequestMusic.add);
routes.delete('/requestMusic/:id', RequestMusic.delete);
routes.get('/requestMusic/:id', RequestMusic.index);
routes.get('/requestMusic', RequestMusic.all);
routes.get('/requestMusic/allForUser/:id', RequestMusic.allForUser);

module.exports = routes;
