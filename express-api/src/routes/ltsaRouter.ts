import controllers from '@/controllers';
import catchErrors from '@/utilities/controllerErrorWrapper';
import express from 'express';

const router = express.Router();

// Endpoints for LTSA title information
router.route('/land/title').get(catchErrors(controllers.getLTSA));

export default router;
