import controllers from '@/controllers';
import express from 'express';

const router = express.Router();

// Endpoints for parcels data manipulation
router
  .route(`/:parcelId`)
  .get(controllers.getParcel)
  .put(controllers.updateParcel)
  .delete(controllers.deleteParcel);
router.route(`/`).get(controllers.getParcels).post(controllers.addParcel);
router.route(`/check/pid-available`).get(controllers.checkPidAvailable);
router.route(`/check/pin-available`).get(controllers.checkPinAvailable);
router.route(`/:parcelId/financials`).put(controllers.updateParcelFinancial);

export default router;
