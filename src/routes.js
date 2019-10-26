import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import MeetappAppointmentController from './app/controllers/MeetappAppointmentController';
import MeetapListUser from './app/controllers/MeetapListUser';
import MeetappScheduleController from './app/controllers/MeetappScheduleController';
import NotificationController from './app/controllers/NotificationController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/', (req, res) => {
    return res.json({ message: 'API 1.0 Meetapp' });
});

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);
routes.get('/users', UserController.show);

routes.get('/providers', ProviderController.index);

routes.post('/meetapp-appointment/:id', MeetappAppointmentController.store);
routes.get('/meetapp-appointment', MeetappAppointmentController.index);

// Meetapps que ainda nao passaram
routes.get('/meetapp-appointment/meetapp-list', MeetapListUser.index);
// routes.delete('/meetapp-appointment/:id', MeetappAppointmentController.delete);

routes.get('/meetapp-schedule', MeetappScheduleController.index);
routes.post('/meetapp-schedule', MeetappScheduleController.store);
routes.put('/meetapp-schedule/:id', MeetappScheduleController.update);
routes.delete('/meetapp-schedule/:id', MeetappScheduleController.delete);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

routes.post('/file', upload.single('file'), FileController.store);

export default routes;
