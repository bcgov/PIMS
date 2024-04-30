import controllers from '@/controllers';
import activeUserCheck from '@/middleware/activeUserCheck';
import catchErrors from '@/utilities/controllerErrorWrapper';
import express from 'express';

const router = express.Router();

const { getBuilding, updateBuilding, deleteBuilding, getBuildings, addBuilding } = controllers;

// Endpoints for buildings data manipulation
router
  .route(`/:buildingId`)
  .get(activeUserCheck, catchErrors(getBuilding))
  .put(activeUserCheck, catchErrors(updateBuilding))
  .delete(activeUserCheck, catchErrors(deleteBuilding));
router
  .route('/')
  .get(activeUserCheck, catchErrors(getBuildings))
  .post(activeUserCheck, catchErrors(addBuilding));
// router.route(`${BUILDINGS_ROUTE}/filter`).post(catchErrors(filterBuildingsRequestBody));
// router.route(`${BUILDINGS_ROUTE}/:buildingId/financials`).put(catchErrors(updateBuildingFinancial));

export default router;
