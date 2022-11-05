require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cookie = require('cookie-parser');
const limiter = require('./middlewares/limiter');
const { cors } = require('./middlewares/cors');
const router = require('./routes/index');
const keyErrorHandler = require('./middlewares/keyErrorHandler');
const { mongodb } = require('./utils/config');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect(mongodb);

app.use(cookie());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors);

app.use(requestLogger);

app.use(helmet());

app.use(limiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(keyErrorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
