import { Router } from 'express';
import { registerAdmin, loginAdmin, logoutAdmin, changeCurrentPassword, getAllReports, changeStatus } from '../controllers/admin.controllers.js';
import { verifyAdminJWT } from '../middlewares/adminAuth.middlware.js'; 
const router = Router();

router.route('/register').post(registerAdmin);
router.route('/login').post(loginAdmin);

router.route('/logout').post(verifyAdminJWT, logoutAdmin);
router.route('/change-password').post(verifyAdminJWT, changeCurrentPassword);
router.route('/allReports').get(getAllReports);
router.route('/changeStatus').post(changeStatus);

export default router;