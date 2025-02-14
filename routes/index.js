import express from "express";
import * as authController from '../controllers/auth.js';
import * as jobController from '../controllers/job.js';
import * as userController from '../controllers/user.js';

const router = express.Router();

// Routes for authentication
router.post('/register', authController.register);                                                         // route for register
router.post('/login', authController.login);                                                               // route for login
router.get('/confirm/:token', authController.confirmEmail);                                                // route for confirming email

// Routes for client action
router.post('/client/jobs', jobController.createJobByClient);                                                      // route for creating Job
router.get('/client/jobs', jobController.getJobListByClient);                                                      // route for getting  Job

router.get('/client/jobs/:id', jobController.getJobDetailByClient);                                                // route for getting detaied Job
    
router.post('/client/jobs/:jobId/folders', jobController.createFolderByJobId);                             // route for creating Folders by Job Id 

router.get('/client/jobs/:jobId/folders/:folderId/files', jobController.getFilesByFolderId);               // route for getting Files by Job Id and Folder Id
router.post('/client/jobs/:jobId/folders/:folderId/files', jobController.uploadFiles);                     // route for uploading Files

// Routes for admin action
router.get('/pilot/profile/:userId', userController.getUserDetail);
router.post('/pilot/profile/certs', userController.uploadCertFiles);
// Routes for pilot action

export default router;