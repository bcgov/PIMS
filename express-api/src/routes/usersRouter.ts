import controllers from '@/controllers';
import catchErrors from '@/utilities/controllerErrorWrapper';
import express from 'express';

const router = express.Router();

const { getUserInfo, getSelf, submitUserAccessRequest, getUserAgencies } = controllers;

router.route(`/info`).get(catchErrors(getUserInfo));
router.route(`/self`).get(catchErrors(getSelf));
// router.route(`/access/requests`).get(getUserAccessRequestLatest);
router.route(`/access/requests`).post(catchErrors(submitUserAccessRequest));
// router.route(`/access/requests/:requestId`).get(getUserAccessRequestById);
// router.route(`/access/requests/:requestId`).put(updateUserAccessRequest);
router.route(`/agencies/:username`).get(catchErrors(getUserAgencies));

export default router;
