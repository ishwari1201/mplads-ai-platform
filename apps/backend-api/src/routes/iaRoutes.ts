import { Router } from 'express';
import { IAController } from '../controllers/iaController';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { authorizeRoles } from '../middlewares/rbacMiddleware';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.use(authenticateJWT);
router.use(authorizeRoles('IMPLEMENTING_AGENCY', 'IA'));

router.get('/works', IAController.getAssignedProjects);
router.get('/works/:id', IAController.getProjectDetail);

router.post('/works/:id/progress', IAController.submitProgressUpdate);
router.post('/works/:id/photos', upload.single('image'), IAController.uploadProgressPhoto);
router.post('/upload-progress', upload.single('image'), IAController.uploadProgressPhoto);

router.post('/works/:id/payment-requests', IAController.submitPaymentRequest);

router.get('/evidence-requests', IAController.getEvidenceRequests);
router.post('/evidence-requests/:id/respond', IAController.respondEvidenceRequest);

export default router;
