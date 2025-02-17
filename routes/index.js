import express from "express";
import * as authController from '../controllers/auth.js';
import * as jobController from '../controllers/job.js';
import * as userController from '../controllers/user.js';
import * as claimController from '../controllers/claim.js';

const router = express.Router();

// Routes for authentication
router.post('/register', authController.register);                                                         // route for register
router.post('/login', authController.login);                                                               // route for login
router.get('/confirm/:token', authController.confirmEmail);     
router.get('/user/cert/:userId', userController.getUserCertificateList);                                           // route for confirming email
router.post('/user/cert/:userId', userController.uploadCertFiles);

// Routes for client action
router.post('/client/jobs', jobController.createJobByClient);                                                      // route for creating Job
router.get('/client/jobs', jobController.getJobListByClient);                                                      // route for getting  Job
router.get('/client/jobs/:id', jobController.getJobDetailByClient);                                                // route for getting detaied Job
router.post('/client/jobs/:jobId/folders', jobController.createFolderByJobId);                             // route for creating Folders by Job Id 
router.get('/client/jobs/:jobId/folders/:folderId/files', jobController.getFilesByFolderId);               // route for getting Files by Job Id and Folder Id
router.post('/client/jobs/:jobId/folders/:folderId/files', jobController.uploadJobFiles);                     // route for uploading Files
router.get('/client/claims', claimController.getClaimRequestListByClient);
router.post('/client/claim/approve', claimController.approveClaimByClient);
router.get('/client/jobs/isdoing/:userId', jobController.getJobListInProgressByClient);

// Routes for admin action
router.get('/pilot/profile/:userId', userController.getUserDetail);
router.post('/pilot/profile/certs', userController.uploadCertFiles);
router.post('/admin/jobs', jobController.getJobListByAdmin);
router.post('/admin/jobs/:jobId/status', jobController.updateJobStatusByAdmin);

// Routes for pilot action
router.get('/pilot/jobs', jobController.getJobListByPilot);
router.get('/pilot/jobs/:id', jobController.getJobDetailByPilot);
router.post('/pilot/claim/new', claimController.makeNewClaimRequestByPilot);
// 

export default router;