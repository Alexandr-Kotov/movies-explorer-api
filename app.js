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

const NOT_FOUND_ERROR = require('./errors/notfound-error');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
const { PORT = 3000, NODE_ENV, MONGO_DB } = process.env;

mongoose.connect(NODE_ENV === 'production' ? MONGO_DB : 'mongodb://localhost:27017/bitfilmsdb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

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

app.use('/*', (req, res, next) => next(new NOT_FOUND_ERROR('Страницы не существует')));

app.use(errorLogger);

app.use(errors());

app.use(keyErrorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});