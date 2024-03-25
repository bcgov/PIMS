import controllers from '@/controllers';
import catchErrors from '@/utilities/controllerErrorWrapper';
import express from 'express';

export const BUILDINGS_ROUTE = '/buildings';

const router = express.Router();

const { getBuilding, updateBuilding, deleteBuilding, getBuildings, addBuilding } = controllers;

// Endpoints for buildings data manipulation
router
  .route(`${BUILDINGS_ROUTE}/:buildingId`)
  .get(catchErrors(getBuilding))
  .put(catchErrors(updateBuilding))
  .delete(catchErrors(deleteBuilding));
router.route(BUILDINGS_ROUTE).get(catchErrors(getBuildings)).post(catchErrors(addBuilding));
// router.route(`${BUILDINGS_ROUTE}/filter`).post(catchErrors(filterBuildingsRequestBody));
// router.route(`${BUILDINGS_ROUTE}/:buildingId/financials`).put(catchErrors(updateBuildingFinancial));

export default router;
