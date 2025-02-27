import express from "express";
import passport from "../config/passport.js";
import * as authController from '../controllers/auth.js';
import * as userController from '../controllers/user.js';

const router = express.Router();

const requireAuth = passport.authenticate('jwt', { session: false });

// Routes for authentication
router.post('/register', authController.register);                                                         // route for register
router.post('/login', authController.login);                                                               // route for login
router.get('/confirm/:token', authController.confirmEmail);
router.get('/user/cert/:userId', userController.getUserCertificateList);                                           // route for confirming email
router.post('/user/cert/:userId', userController.uploadCertFiles);
router.get('/user/pilots', userController.getPilotListByHomePage);


export default router;