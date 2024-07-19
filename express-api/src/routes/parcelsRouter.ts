import controllers from '@/controllers';
import activeUserCheck from '@/middleware/activeUserCheck';
import catchErrors from '@/utilities/controllerErrorWrapper';
import express from 'express';

const router = express.Router();

const { getParcel, updateParcel, deleteParcel, getParcels, addParcel } = controllers;

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

export default router;
