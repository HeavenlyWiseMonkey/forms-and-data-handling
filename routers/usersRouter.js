const { Router } = require('express');
const usersRouter = Router();
const usersController = require('../controllers/usersController');

usersRouter.get('/', usersController.usersListGet);

usersRouter.get('/create', usersController.usersCreateGet);
usersRouter.post('/create', usersController.usersCreatePost);

usersRouter.get('/:id/update', usersController.usersUpdateGet);
usersRouter.post('/:id/update', usersController.usersUpdatePost);
usersRouter.post('/:id/delete', usersController.usersDeletePost);

usersRouter.get('/searchUser', usersController.usersSearch);
usersRouter.get('/search', usersController.usersSearchGet);

module.exports = usersRouter;