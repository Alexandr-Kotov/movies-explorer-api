const userRouter = require('express').Router();

const { getUserById, updateProfile } = require('../controllers/user');

const { updateProfileValidation } = require('../middlewares/validation');

userRouter.get('/me', getUserById);

userRouter.patch('/me', updateProfileValidation, updateProfile);

module.exports = userRouter;