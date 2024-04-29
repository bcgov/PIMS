import { Roles } from '@/constants/roles';
import {
  getAdministrativeAreas,
  addAdministrativeArea,
  getAdministrativeAreaById,
  updateAdministrativeAreaById,
  deleteAdministrativeAreaById,
} from '@/controllers/administrativeAreas/administrativeAreasController';
import activeUserCheck from '@/middleware/activeUserCheck';
import catchErrors from '@/utilities/controllerErrorWrapper';
import { protectedRoute } from '@bcgov/citz-imb-sso-express';
import express from 'express';

const router = express.Router();

// Endpoints for Admin Administrative Areas
router
  .route(`/`)
  .get(activeUserCheck, catchErrors(getAdministrativeAreas))
  .post(protectedRoute([Roles.ADMIN]), activeUserCheck, catchErrors(addAdministrativeArea));

router
  .route(`/:id`)
  .get(activeUserCheck, catchErrors(getAdministrativeAreaById))
  .put(protectedRoute([Roles.ADMIN]), activeUserCheck, catchErrors(updateAdministrativeAreaById)) // TODO: Should this be a patch?
  .delete(
    protectedRoute([Roles.ADMIN]),
    activeUserCheck,
    catchErrors(deleteAdministrativeAreaById),
  );

export default router;
