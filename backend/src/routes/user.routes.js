import {Router} from 'express';
import {handleClerkWebhook, logoutUser, changeCurrentPassword, registerIssues, getAllReports, getLeaderboard, getReportStatus, getUserNotifications, markNotificationAsRead, getCloudinarySignature, streamReportUpdates} from '../controllers/user.controllers.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.route('/clerk-webhook').post(handleClerkWebhook);


router.route('/logout').post(verifyJWT, logoutUser);
router.route('/change-password').post(verifyJWT, changeCurrentPassword);
router.route('/upload-signature').get(verifyJWT, getCloudinarySignature);
router.route('/validate').post(upload.fields([{
    name : "civicIssue",
    maxCount : 1
}]),verifyJWT,registerIssues);
router.route('/getAllIssues').get(verifyJWT,getAllReports);
router.route('/getLeaderboard').get(verifyJWT,getLeaderboard);
router.route('/checkStatus').get(verifyJWT,getReportStatus);
router.route('/checkStatus/:jobId').get(verifyJWT,getReportStatus);
router.route('/notifications').get(verifyJWT,getUserNotifications);
router.route('/notifications/:notificationId').patch(verifyJWT,markNotificationAsRead);
router.route('/reports/stream').get(verifyJWT, streamReportUpdates);

export default router;