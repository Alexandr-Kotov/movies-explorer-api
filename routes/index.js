const router = require('express').Router();
const { createUser, login, signout } = require('../controllers/user');
const auth = require('../middlewares/auth');
const { createUserValidation, loginValidation } = require('../middlewares/validation');
const userRouter = require('./user');
const movieRouter = require('./movie');

router.post('/signup', createUserValidation, createUser);

router.post('/signin', loginValidation, login);

router.use(auth);

router.use('/users', userRouter);

router.use('/movies', movieRouter);

router.get('/signout', signout);

module.exports = router;
