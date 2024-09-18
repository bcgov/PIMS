import {
  addAgency,
  deleteAgencyById,
  getAgencies,
  getAgencyById,
  updateAgencyById,
} from '@/controllers/agencies/agenciesController';
import catchErrors from '@/utilities/controllerErrorWrapper';
import express from 'express';

const router = express.Router();

// Endpoints for Admin Agencies
router.route(`/`).get(catchErrors(getAgencies)).post(catchErrors(addAgency));

router
  .route(`/:id`)
  .get(catchErrors(getAgencyById))
  .patch(catchErrors(updateAgencyById))
  .delete(catchErrors(deleteAgencyById));

export default router;
