import { Roles } from '@/constants/roles';
import {
  getAdministrativeAreas,
  addAdministrativeArea,
  getAdministrativeAreaById,
  updateAdministrativeAreaById,
  deleteAdministrativeAreaById,
} from '@/controllers/admin/administrativeAreas/administrativeAreasController';
import { protectedRoute } from '@bcgov/citz-imb-kc-express';
import express from 'express';

const router = express.Router();

// Endpoints for Admin Administrative Areas
router
  .route(`/`)
  .get(getAdministrativeAreas)
  .post(protectedRoute([Roles.ADMIN]), addAdministrativeArea);

router
  .route(`/:id`)
  .get(getAdministrativeAreaById)
  .put(protectedRoute([Roles.ADMIN]), updateAdministrativeAreaById) // TODO: Should this be a patch?
  .delete(protectedRoute([Roles.ADMIN]), deleteAdministrativeAreaById);

export default router;
