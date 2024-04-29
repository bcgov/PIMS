import { Roles } from '@/constants/roles';
import {
  addAgency,
  deleteAgencyById,
  getAgencies,
  getAgencyById,
  updateAgencyById,
} from '@/controllers/agencies/agenciesController';
import activeUserCheck from '@/middleware/activeUserCheck';
import catchErrors from '@/utilities/controllerErrorWrapper';
import { protectedRoute } from '@bcgov/citz-imb-sso-express';
import express from 'express';

const router = express.Router();

// Endpoints for Admin Agencies
router
  .route(`/`)
  .get(protectedRoute(), activeUserCheck, catchErrors(getAgencies))
  .post(protectedRoute([Roles.ADMIN]), activeUserCheck, catchErrors(addAgency));

router
  .route(`/:id`)
  .get(protectedRoute(), activeUserCheck, catchErrors(getAgencyById))
  .patch(protectedRoute([Roles.ADMIN]), activeUserCheck, catchErrors(updateAgencyById))
  .delete(protectedRoute([Roles.ADMIN]), activeUserCheck, catchErrors(deleteAgencyById));

export default router;
