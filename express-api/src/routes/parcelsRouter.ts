import controllers from '@/controllers';
import catchErrors from '@/utilities/controllerErrorWrapper';
import express from 'express';

const router = express.Router();

const { getParcel, updateParcel, deleteParcel, getParcels, addParcel } = controllers;

// Endpoints for parcels data manipulation
router
  .route(`/:parcelId`)
  .get(catchErrors(getParcel))
  .put(catchErrors(updateParcel))
  .delete(catchErrors(deleteParcel));
router.route(`/`).get(catchErrors(getParcels)).post(catchErrors(addParcel));

export default router;
