import { Roles } from '@/constants/roles';
import controllers from '@/controllers';
import activeUserCheck from '@/middleware/activeUserCheck';
import catchErrors from '@/utilities/controllerErrorWrapper';
import { protectedRoute } from '@bcgov/citz-imb-sso-express';
import express from 'express';

const router = express.Router();

const {
  getUserInfo,
  getSelf,
  submitUserAccessRequest,
  getUserAgencies,
  addUser,
  deleteUserById,
  getUserById,
  getUserRolesByName,
  getUsers,
  getUsersSameAgency,
  updateUserById,
  getAllRoles,
  updateUserRolesByName,
} = controllers;

router.route(`/info`).get(catchErrors(getUserInfo));
router.route(`/self`).get(catchErrors(getSelf));
// router.route(`/access/requests`).get(getUserAccessRequestLatest);
router.route(`/access/requests`).post(catchErrors(submitUserAccessRequest));
// router.route(`/access/requests/:requestId`).get(getUserAccessRequestById);
// router.route(`/access/requests/:requestId`).put(updateUserAccessRequest);
router.route(`/agencies/:username`).get(activeUserCheck, catchErrors(getUserAgencies));

router
  .route(`/`)
  .get(activeUserCheck, catchErrors(getUsers))
  .post(protectedRoute([Roles.ADMIN]), activeUserCheck, catchErrors(addUser));

router.route(`/my/agency`).post(activeUserCheck, catchErrors(getUsersSameAgency)); // TODO: Should this just be generic: get users from an agency?

router.route(`/roles`).get(activeUserCheck, catchErrors(getAllRoles));

router
  .route(`/roles/:username`)
  .get(activeUserCheck, catchErrors(getUserRolesByName))
  .put(protectedRoute([Roles.ADMIN]), activeUserCheck, catchErrors(updateUserRolesByName));

router
  .route(`/:id`)
  .get(activeUserCheck, catchErrors(getUserById))
  .put(protectedRoute([Roles.ADMIN]), activeUserCheck, catchErrors(updateUserById)) // TODO: should put be a patch?
  .delete(protectedRoute([Roles.ADMIN]), activeUserCheck, catchErrors(deleteUserById));

export default router;
