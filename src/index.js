const path = require('path');
const express = require('express');
const cors = require('cors');

const routesRegister = require('./routes/register.routes');
const routesShow = require('./routes/show.routes');
const routesMusics = require('./routes/musics.routes');
const routesNameList = require('./routes/nameList.routes');
const routesFile = require('./routes/file.routes');

const dir = path.resolve(__dirname, '..', 'public');

const app = express();
app.use(express.static(dir));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routesRegister);
app.use(routesShow);
app.use(routesFile);
app.use(routesMusics);
app.use(routesNameList);

app.listen(process.env.PORT || 3333);
