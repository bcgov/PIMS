import { Roles } from '@/constants/roles';
import controllers from '@/controllers';
import userAuthCheck from '@/middleware/userAuthCheck';
import catchErrors from '@/utilities/controllerErrorWrapper';
import express from 'express';

const router = express.Router();

const { getSelf, submitUserAccessRequest, getUserAgencies, getUserById, getUsers, updateUserById } =
  controllers;

router.route(`/self`).get(catchErrors(getSelf));
router.route(`/access/requests`).post(catchErrors(submitUserAccessRequest));
router.route(`/agencies/:username`).get(userAuthCheck(), catchErrors(getUserAgencies));

router.route(`/`).get(userAuthCheck(), catchErrors(getUsers));

router
  .route(`/:id`)
  .get(userAuthCheck(), catchErrors(getUserById))
  .put(userAuthCheck({ requiredRoles: [Roles.ADMIN] }), catchErrors(updateUserById));

export default router;
