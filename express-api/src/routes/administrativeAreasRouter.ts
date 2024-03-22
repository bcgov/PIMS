import { Roles } from '@/constants/roles';
import {
  getAdministrativeAreas,
  addAdministrativeArea,
  getAdministrativeAreaById,
  updateAdministrativeAreaById,
  deleteAdministrativeAreaById,
} from '@/controllers/administrativeAreas/administrativeAreasController';
import catchErrors from '@/utilities/controllerErrorWrapper';
import { protectedRoute } from '@bcgov/citz-imb-kc-express';
import express from 'express';

const router = express.Router();

// Endpoints for Admin Administrative Areas
router
  .route(`/`)
  .get(getAdministrativeAreas)
  .post(protectedRoute([Roles.ADMIN]), catchErrors(addAdministrativeArea));

router
  .route(`/:id`)
  .get(getAdministrativeAreaById)
  .put(protectedRoute([Roles.ADMIN]), catchErrors(updateAdministrativeAreaById)) // TODO: Should this be a patch?
  .delete(protectedRoute([Roles.ADMIN]), catchErrors(deleteAdministrativeAreaById));

export default router;
