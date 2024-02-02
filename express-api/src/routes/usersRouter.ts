import controllers from '@/controllers';
import express from 'express';

const router = express.Router();

router.route(`/info`).get(controllers.getUserInfo);
router.route(`/access/requests`).get(controllers.getUserAccessRequestLatest);
router.route(`/access/requests`).post(controllers.submitUserAccessRequest);
router.route(`/access/requests/:requestId`).get(controllers.getUserAccessRequestById);
router.route(`/access/requests/:requestId`).put(controllers.updateUserAccessRequest);
router.route(`/agencies/:username`).get(controllers.getUserAgencies);

export default router;
