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
  addAgency,
  deleteAgencyById,
  getAgencies,
  getAgenciesFiltered,
  getAgencyById,
  updateAgencyById,
  addClaim,
  deleteClaimById,
  getClaimById,
  getClaims,
  updateClaimById,
  addRole,
  deleteRoleById,
  getRoleById,
  getRoleByName,
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
  getUsersByFilter,
  getUsersSameAgency,
  updateUserById,
} = controllers.admin;

const ADMIN_ROUTE = '/admin';

// Endpoints for Admin Access Requests
router.route(`${ADMIN_ROUTE}/accessRequests`).get(getAccessRequests).delete(deleteAccessRequest);

// Endpoints for Admin Administrative Areas
router
  .route(`${ADMIN_ROUTE}/administrativeAreas`)
  .get(getAdministrativeAreas)
  .post(addAdministrativeArea);

router.route(`${ADMIN_ROUTE}/administrativeAreas/filter`).post(getAdministrativeAreasFiltered); // TODO: Could be a get with query strings

router
  .route(`${ADMIN_ROUTE}/administrativeAreas/:id`)
  .get(getAdministrativeAreaById)
  .put(updateAdministrativeAreaById) // TODO: Should this be a patch?
  .delete(deleteAdministrativeAreaById);

// Endpoints for Admin Agencies
router.route(`${ADMIN_ROUTE}/agencies`).get(getAgencies).post(addAgency);

router
  .route(`${ADMIN_ROUTE}/agencies/:id`)
  .get(getAgencyById)
  .put(updateAgencyById)
  .delete(deleteAgencyById); // TODO: should put be a patch?

router.route(`${ADMIN_ROUTE}/agencies/filter`).post(getAgenciesFiltered); // TODO: Should this be GET with query strings?

// Endpoints for Admin Claims
router.route(`${ADMIN_ROUTE}/claims`).get(getClaims).post(addClaim);

router
  .route(`${ADMIN_ROUTE}/claims/:id`)
  .get(getClaimById)
  .put(updateClaimById) // TODO: should put be a patch?
  .delete(deleteClaimById);

// Endpoints for Admin Roles
router.route(`${ADMIN_ROUTE}/roles`).get(getRoles).post(addRole);

router
  .route(`${ADMIN_ROUTE}/roles/:id`)
  .get(getRoleById)
  .put(updateRoleById) // TODO: should put be a patch?
  .delete(deleteRoleById);

router.route(`${ADMIN_ROUTE}/roles/name/:name`).get(getRoleByName);

// Endpoints for Admin Users
router.route(`${ADMIN_ROUTE}/users`).get(getUsers).post(addUser);

router.route(`${ADMIN_ROUTE}/users/filter`).post(getUsersByFilter); // TODO: GET with query strings instead?

router.route(`${ADMIN_ROUTE}/users/my/agency`).post(getUsersSameAgency); // TODO: Should this just be generic: get users from an agency?

router
  .route(`${ADMIN_ROUTE}/users/:id`)
  .get(getUserById)
  .put(updateUserById) // TODO: should put be a patch?
  .delete(deleteUserById);

router
  .route(`${ADMIN_ROUTE}/users/roles/:username`)
  .get(getUserRolesByName)
  .post(addUserRoleByName)
  .delete(deleteUserRoleByName);

export default router;
