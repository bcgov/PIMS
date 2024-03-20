import controllers from '@/controllers';
import { updateUserRolesByName } from '@/controllers/admin/users/usersController';
import catchErrors from '@/utilities/controllerErrorWrapper';
import express from 'express';

const router = express.Router();

const {
  addAdministrativeArea,
  deleteAdministrativeAreaById,
  getAdministrativeAreaById,
  getAdministrativeAreas,
  getAdministrativeAreasFiltered,
  updateAdministrativeAreaById,
  addClaim,
  deleteClaimById,
  getClaimById,
  getClaims,
  updateClaimById,
  addRole,
  deleteRoleById,
  getRoleById,
  getRoles,
  updateRoleById,
  deleteAccessRequest,
  getAccessRequests,
  addUser,
  deleteUserById,
  getUserById,
  getUserRolesByName,
  getUsers,
  getUsersSameAgency,
  updateUserById,
  getAllRoles,
} = controllers.admin;

// Endpoints for Admin Access Requests
router
  .route(`/accessRequests`)
  .get(catchErrors(getAccessRequests))
  .delete(catchErrors(deleteAccessRequest));

// Endpoints for Admin Administrative Areas
router
  .route(`/administrativeAreas`)
  .get(catchErrors(getAdministrativeAreas))
  .post(catchErrors(addAdministrativeArea));

router.route(`/administrativeAreas/filter`).post(catchErrors(getAdministrativeAreasFiltered)); // TODO: Could be a get with query strings

router
  .route(`/administrativeAreas/:id`)
  .get(catchErrors(getAdministrativeAreaById))
  .put(catchErrors(updateAdministrativeAreaById)) // TODO: Should this be a patch?
  .delete(catchErrors(deleteAdministrativeAreaById));

// Endpoints for Admin Claims
router.route(`/claims`).get(catchErrors(getClaims)).post(catchErrors(addClaim));

router
  .route(`/claims/:id`)
  .get(catchErrors(getClaimById))
  .put(catchErrors(updateClaimById)) // TODO: should put be a patch?
  .delete(catchErrors(deleteClaimById));

// Endpoints for Admin Roles
router.route(`/roles`).get(catchErrors(getRoles)).post(catchErrors(addRole));

router
  .route(`/roles/:id`)
  .get(catchErrors(getRoleById))
  .put(catchErrors(updateRoleById)) // TODO: should put be a patch?
  .delete(catchErrors(deleteRoleById));

// Endpoints for Admin Users
router.route(`/users`).get(catchErrors(getUsers)).post(catchErrors(addUser));

router.route(`/users/my/agency`).post(catchErrors(getUsersSameAgency)); // TODO: Should this just be generic: get users from an agency?

router.route(`/users/roles`).get(catchErrors(getAllRoles));

router
  .route(`/users/roles/:username`)
  .get(catchErrors(getUserRolesByName))
  .put(catchErrors(updateUserRolesByName));

router
  .route(`/users/:id`)
  .get(catchErrors(getUserById))
  .put(catchErrors(updateUserById)) // TODO: should put be a patch?
  .delete(deleteUserById);

export default router;
