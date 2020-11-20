const express = require('express');
const routes = express.Router();

const Register = require('../app/controllers/Register');
const RegisterCont = require('../app/controllers/RegisterController');

routes.post('/register', Register.add);
routes.post('/autentication', Register.autentication);
routes.post('/forgot_password', Register.forgotPassword);
routes.post('/reset_passWord', Register.resetarPassWord);
routes.put('/edit/:id', Register.edit);
routes.put('/editPerfil/:id', Register.editPerfil);

routes.get('/register/all', RegisterCont.all);

module.exports = routes;
