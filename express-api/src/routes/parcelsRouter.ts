import controllers from '@/controllers';
import express from 'express';

const router = express.Router();

const PARCELS_ROUTE = '/parcels';

// Endpoints for parcels data manipulation
router
  .route(`${PARCELS_ROUTE}/:parcelId`)
  .get(controllers.getParcel)
  .put(controllers.updateParcel)
  .delete(controllers.deleteParcel);
router
  .route(`${PARCELS_ROUTE}/`)
  .get(controllers.filterParcelsQueryString)
  .post(controllers.addParcel);
router.route(`${PARCELS_ROUTE}/filter`).post(controllers.filterParcelsRequestBody);
router.route(`${PARCELS_ROUTE}/check/pid-available`).get(controllers.checkPidAvailable);
router.route(`${PARCELS_ROUTE}/check/pin-available`).get(controllers.checkPinAvailable);
router.route(`${PARCELS_ROUTE}/:parcelId/financials`).put(controllers.updateParcelFinancial);

export default router;
