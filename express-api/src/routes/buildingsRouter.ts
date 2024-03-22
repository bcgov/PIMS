import controllers from '@/controllers';
import catchErrors from '@/utilities/controllerErrorWrapper';
import express from 'express';

export const BUILDINGS_ROUTE = '/buildings';

const router = express.Router();

const {
  getBuilding,
  updateBuilding,
  deleteBuilding,
  getBuildings,
  addBuilding,
  updateBuildingFinancial,
} = controllers;

// Endpoints for buildings data manipulation
router
  .route(`/:buildingId`)
  .get(catchErrors(getBuilding))
  .put(catchErrors(updateBuilding))
  .delete(catchErrors(deleteBuilding));
router.route(`/`).get(catchErrors(getBuildings)).post(catchErrors(addBuilding));
router.route(`/filter`).post(catchErrors(getBuildings));
router.route(`/:buildingId/financials`).put(catchErrors(updateBuildingFinancial));

export default router;
