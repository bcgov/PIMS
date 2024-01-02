import controllers from '@/controllers';
import express from 'express';

const router = express.Router();

export const USERS_API = '/users';

router.route(`${USERS_API}/info`).get(controllers.getUserInfo);
router.route(`${USERS_API}/access/requests`).get(controllers.getUserAccessRequestLatest);
router.route(`${USERS_API}/access/requests`).post(controllers.submitUserAccessRequest);
router.route(`${USERS_API}/access/requests/:requestId`).get(controllers.getUserAccessRequestById);
router.route(`${USERS_API}/access/requests/:requestId`).put(controllers.updateUserAccessRequest);
router.route(`${USERS_API}/agencies/:username`).get(controllers.getUserAgencies);
router.route(`${USERS_API}/reports/users`).get(controllers.getUserReport);
router.route(`${USERS_API}/reports/users/filter`).post(controllers.filterUserReport);

export default router;
