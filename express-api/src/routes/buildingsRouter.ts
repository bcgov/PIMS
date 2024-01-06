import controllers from '@/controllers';
import express from 'express';

export const BUILDINGS_ROUTE = '/properties/buildings';

const router = express.Router();

// Endpoints for buildings data manipulation
router
  .route(`${BUILDINGS_ROUTE}/:buildingId`)
  .get(controllers.getBuilding)
  .put(controllers.updateBuilding)
  .delete(controllers.deleteBuilding);
router
  .route(BUILDINGS_ROUTE)
  .get(controllers.filterBuildingsQueryString)
  .post(controllers.addBuilding);
router.route(`${BUILDINGS_ROUTE}/filter`).post(controllers.filterBuildingsRequestBody);
router.route(`${BUILDINGS_ROUTE}/check/pid-available`).get(controllers.checkPidAvailable);
router.route(`${BUILDINGS_ROUTE}/check/pin-available`).get(controllers.checkPinAvailable);
router.route(`${BUILDINGS_ROUTE}/:buildingId/financials`).put(controllers.updateBuildingFinancial);

export default router;
