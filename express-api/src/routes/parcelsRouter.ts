import controllers from '@/controllers';
import catchErrors from '@/utilities/controllerErrorWrapper';
import express from 'express';

const router = express.Router();

const {
  getParcel,
  updateParcel,
  deleteParcel,
  filterParcelsQueryString,
  addParcel,
  checkPidAvailable,
  checkPinAvailable,
  updateParcelFinancial,
} = controllers;

// Endpoints for parcels data manipulation
router
  .route(`/:parcelId`)
  .get(catchErrors(getParcel))
  .put(catchErrors(updateParcel))
  .delete(catchErrors(deleteParcel));
router
  .route(`/`)
  .get(catchErrors(getParcels))
  .post(catchErrors(addParcel));
router.route(`${PARCELS_ROUTE}/check/pid-available`).get(catchErrors(checkPidAvailable));
router.route(`${PARCELS_ROUTE}/check/pin-available`).get(catchErrors(checkPinAvailable));
router.route(`${PARCELS_ROUTE}/:parcelId/financials`).put(catchErrors(updateParcelFinancial));

export default router;
