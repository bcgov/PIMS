import { Roles } from '@/constants/roles';
import {
  getAdministrativeAreas,
  addAdministrativeArea,
  getAdministrativeAreaById,
  updateAdministrativeAreaById,
} from '@/controllers/administrativeAreas/administrativeAreasController';
import activeUserCheck from '@/middleware/activeUserCheck';
import catchErrors from '@/utilities/controllerErrorWrapper';
import express from 'express';

const router = express.Router();

// Endpoints for Admin Administrative Areas
router
  .route(`/`)
  .get(activeUserCheck([Roles.ADMIN]), catchErrors(getAdministrativeAreas))
  .post(activeUserCheck([Roles.ADMIN]), catchErrors(addAdministrativeArea));

router
  .route(`/:id`)
  .get(activeUserCheck([Roles.ADMIN]), catchErrors(getAdministrativeAreaById))
  .put(activeUserCheck([Roles.ADMIN]), catchErrors(updateAdministrativeAreaById));

export default router;
