import {
  getAdministrativeAreas,
  addAdministrativeArea,
  getAdministrativeAreaById,
  updateAdministrativeAreaById,
} from '@/controllers/administrativeAreas/administrativeAreasController';
import catchErrors from '@/utilities/controllerErrorWrapper';
import express from 'express';

const router = express.Router();

// Endpoints for Admin Administrative Areas
router.route(`/`).get(catchErrors(getAdministrativeAreas)).post(catchErrors(addAdministrativeArea));

router
  .route(`/:id`)
  .get(catchErrors(getAdministrativeAreaById))
  .put(catchErrors(updateAdministrativeAreaById));

export default router;
