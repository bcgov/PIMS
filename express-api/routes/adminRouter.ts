import controllers from '../controllers';
import express from 'express';
import {
  addAdministrativeArea,
  deleteAdministrativeAreaById,
  getAdministrativeAreaById,
  getAdministrativeAreas,
  getAdministrativeAreasFiltered,
  updateAdministrativeAreaById,
} from '../controllers/admin/administrativeAreas/administrativeAreasController';

const router = express.Router();

const { getAccessRequests, deleteAccessRequest } = controllers;

const ADMIN_ROUTE = '/admin';

// Endpoints for Admin Access Requests
router.route(`${ADMIN_ROUTE}/accessRequests`).get(getAccessRequests).delete(deleteAccessRequest);

// Endpoints for Admin Administrative Areas
router
  .route(`${ADMIN_ROUTE}/administrativeAreas/areas`)
  .get(getAdministrativeAreas)
  .post(addAdministrativeArea);

router
  .route(`${ADMIN_ROUTE}/administrativeAreas/areas/filter`)
  .post(getAdministrativeAreasFiltered); // TODO: Could be a get with query strings

router
  .route(`${ADMIN_ROUTE}/administrativeAreas/areas/:id`)
  .get(getAdministrativeAreaById)
  .put(updateAdministrativeAreaById) // TODO: Should this be a patch?
  .delete(deleteAdministrativeAreaById);

// Endpoints for Admin Agencies

// Endpoints for Admin Claims

// Endpoints for Admin Users

export default router;
