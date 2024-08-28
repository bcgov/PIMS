import { Roles } from '@/constants/roles';
import controllers from '@/controllers';
import activeUserCheck from '@/middleware/activeUserCheck';
import catchErrors from '@/utilities/controllerErrorWrapper';
import { protectedRoute } from '@bcgov/citz-imb-sso-express';
import express from 'express';

const router = express.Router();

const { getSelf, submitUserAccessRequest, getUserAgencies, getUserById, getUsers, updateUserById } =
  controllers;

router.route(`/self`).get(catchErrors(getSelf));
router.route(`/access/requests`).post(catchErrors(submitUserAccessRequest));
router.route(`/agencies/:username`).get(activeUserCheck, catchErrors(getUserAgencies));

router.route(`/`).get(activeUserCheck, catchErrors(getUsers));

router
  .route(`/:id`)
  .get(activeUserCheck, catchErrors(getUserById))
  .put(protectedRoute([Roles.ADMIN]), activeUserCheck, catchErrors(updateUserById));

export default router;
