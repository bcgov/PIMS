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

export default router;
