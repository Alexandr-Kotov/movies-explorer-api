const router = require('express').Router();
const auth = require('../middlewares/auth');
const userRouter = require('./user');
const movieRouter = require('./movie');
const { createUser, login } = require('../controllers/user');
const { createUserValidation, loginValidation } = require('../middlewares/validation');
const NOT_FOUND_ERROR = require('../errors/notfound-error');

router.post('/signin', loginValidation, login);

router.post('/signup', createUserValidation, createUser);

router.use(auth);

router.use('/users', userRouter);

router.use('/movies', movieRouter);

router.use('/*', (req, res, next) => next(new NOT_FOUND_ERROR('Страницы не существует')));

module.exports = router;
