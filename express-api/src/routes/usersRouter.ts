import { Roles } from '@/constants/roles';
import controllers from '@/controllers';
import catchErrors from '@/utilities/controllerErrorWrapper';
import { protectedRoute } from '@bcgov/citz-imb-kc-express';
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
router.route(`/agencies/:username`).get(catchErrors(getUserAgencies));

router
  .route(`/`)
  .get(catchErrors(getUsers))
  .post(protectedRoute([Roles.ADMIN]), catchErrors(addUser));

router.route(`/my/agency`).post(catchErrors(getUsersSameAgency)); // TODO: Should this just be generic: get users from an agency?

router.route(`/roles`).get(catchErrors(getAllRoles));

router
  .route(`/roles/:username`)
  .get(catchErrors(getUserRolesByName))
  .put(protectedRoute([Roles.ADMIN]), catchErrors(updateUserRolesByName));

router
  .route(`/:id`)
  .get(catchErrors(getUserById))
  .put(protectedRoute([Roles.ADMIN]), catchErrors(updateUserById)) // TODO: should put be a patch?
  .delete(protectedRoute([Roles.ADMIN]), deleteUserById);

export default router;
