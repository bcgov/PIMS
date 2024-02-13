import controllers from '@/controllers';
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
  addUserRoleByName,
  deleteUserById,
  deleteUserRoleByName,
  getUserById,
  getUserRolesByName,
  getUsers,
  getUsersSameAgency,
  updateUserById,
} = controllers.admin;

// Endpoints for Admin Access Requests
router.route(`/accessRequests`).get(getAccessRequests).delete(deleteAccessRequest);

// Endpoints for Admin Administrative Areas
router.route(`/administrativeAreas`).get(getAdministrativeAreas).post(addAdministrativeArea);

router.route(`/administrativeAreas/filter`).post(getAdministrativeAreasFiltered); // TODO: Could be a get with query strings

router
  .route(`/administrativeAreas/:id`)
  .get(getAdministrativeAreaById)
  .put(updateAdministrativeAreaById) // TODO: Should this be a patch?
  .delete(deleteAdministrativeAreaById);

// Endpoints for Admin Claims
router.route(`/claims`).get(getClaims).post(addClaim);

router
  .route(`/claims/:id`)
  .get(getClaimById)
  .put(updateClaimById) // TODO: should put be a patch?
  .delete(deleteClaimById);

// Endpoints for Admin Roles
router.route(`/roles`).get(getRoles).post(addRole);

router
  .route(`/roles/:id`)
  .get(getRoleById)
  .put(updateRoleById) // TODO: should put be a patch?
  .delete(deleteRoleById);

// router.route(`/roles/name/:name`).get(getRoleByName);

// Endpoints for Admin Users
router.route(`/users`).get(getUsers).post(addUser);

router.route(`/users/my/agency`).post(getUsersSameAgency); // TODO: Should this just be generic: get users from an agency?

router
  .route(`/users/:id`)
  .get(getUserById)
  .put(updateUserById) // TODO: should put be a patch?
  .delete(deleteUserById);

router
  .route(`/users/roles/:username`)
  .get(getUserRolesByName)
  .post(addUserRoleByName)
  .delete(deleteUserRoleByName);

export default router;
