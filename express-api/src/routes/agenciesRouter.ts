import { Roles } from '@/constants/roles';
import {
  addAgency,
  deleteAgencyById,
  getAgencies,
  getAgencyById,
  updateAgencyById,
} from '@/controllers/agencies/agenciesController';
import catchErrors from '@/utilities/controllerErrorWrapper';
import { protectedRoute } from '@bcgov/citz-imb-kc-express';
import express from 'express';

const router = express.Router();

// Endpoints for Admin Agencies
router
  .route(`/`)
  .get(getAgencies)
  .post(protectedRoute([Roles.ADMIN]), catchErrors(addAgency));

router
  .route(`/:id`)
  .get(getAgencyById)
  .patch(protectedRoute([Roles.ADMIN]), catchErrors(updateAgencyById))
  .delete(protectedRoute([Roles.ADMIN]), catchErrors(deleteAgencyById));

export default router;
