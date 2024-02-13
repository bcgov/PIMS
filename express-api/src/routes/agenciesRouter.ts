import { Roles } from '@/constants/roles';
import {
  addAgency,
  deleteAgencyById,
  getAgencies,
  getAgencyById,
  updateAgencyById,
} from '@/controllers/agencies/agenciesController';
import { protectedRoute } from '@bcgov/citz-imb-kc-express';
import express from 'express';

const router = express.Router();

// Endpoints for Admin Agencies
router
  .route(`/`)
  .get(getAgencies)
  .post(protectedRoute([Roles.ADMIN]), addAgency);

router
  .route(`/:id`)
  .get(getAgencyById)
  .patch(protectedRoute([Roles.ADMIN]), updateAgencyById)
  .delete(protectedRoute([Roles.ADMIN]), deleteAgencyById);

export default router;
