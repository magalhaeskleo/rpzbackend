const express = require('express');
const routes = express.Router();

const NameList = require('../app/controllers/NameListController');

routes.post('/nameForList', NameList.add);
routes.get('/nameForList/allForUser/:id', NameList.allForUser);
routes.get('/nameForList', NameList.all);

module.exports = routes;
