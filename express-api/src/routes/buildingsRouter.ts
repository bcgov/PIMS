import controllers from '@/controllers';
import catchErrors from '@/utilities/controllerErrorWrapper';
import express from 'express';

const router = express.Router();

const { getBuilding, updateBuilding, deleteBuilding, getBuildings, addBuilding } = controllers;

// Endpoints for buildings data manipulation
router
  .route(`/:buildingId`)
  .get(catchErrors(getBuilding))
  .put(catchErrors(updateBuilding))
  .delete(catchErrors(deleteBuilding));
router.route('/').get(catchErrors(getBuildings)).post(catchErrors(addBuilding));
// router.route(`${BUILDINGS_ROUTE}/filter`).post(catchErrors(filterBuildingsRequestBody));
// router.route(`${BUILDINGS_ROUTE}/:buildingId/financials`).put(catchErrors(updateBuildingFinancial));

export default router;
