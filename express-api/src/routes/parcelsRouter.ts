import controllers from '@/controllers';
import activeUserCheck from '@/middleware/activeUserCheck';
import catchErrors from '@/utilities/controllerErrorWrapper';
import express from 'express';

const router = express.Router();

const {
  getParcel,
  updateParcel,
  deleteParcel,
  getParcels,
  addParcel,
  checkPidAvailable,
  checkPinAvailable,
  updateParcelFinancial,
} = controllers;

// Endpoints for parcels data manipulation
router
  .route(`/:parcelId`)
  .get(activeUserCheck, catchErrors(getParcel))
  .put(activeUserCheck, catchErrors(updateParcel))
  .delete(activeUserCheck, catchErrors(deleteParcel));
router
  .route(`/`)
  .get(activeUserCheck, catchErrors(getParcels))
  .post(activeUserCheck, catchErrors(addParcel));
router.route(`/check/pid-available`).get(activeUserCheck, catchErrors(checkPidAvailable));
router.route(`/check/pin-available`).get(activeUserCheck, catchErrors(checkPinAvailable));
router.route(`/:parcelId/financials`).put(activeUserCheck, catchErrors(updateParcelFinancial));

export default router;
