import controllers from '@/controllers';
import express from 'express';

export const PARCELS_ROUTE = '/properties/parcels';

const router = express.Router();

// Endpoints for parcels data manipulation
router.route(`${PARCELS_ROUTE}/:parcelId`).get(controllers.getParcel);
router.route(`${PARCELS_ROUTE}/:parcelId`).put(controllers.updateParcel);
router.route(`${PARCELS_ROUTE}/:parcelId`).delete(controllers.deleteParcel);
router.route(PARCELS_ROUTE).get(controllers.filterParcelsQueryString);
router.route(PARCELS_ROUTE).post(controllers.addParcel);
router.route(`${PARCELS_ROUTE}/filter`).post(controllers.filterParcelsRequestBody);
router.route(`${PARCELS_ROUTE}/check/pid-available`).get(controllers.checkPidAvailable);
router.route(`${PARCELS_ROUTE}/check/pin-available`).get(controllers.checkPinAvailable);
router.route(`${PARCELS_ROUTE}/:parcelId/financials`).put(controllers.updateParcelFinancial);

export default router;
