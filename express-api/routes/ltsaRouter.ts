import controllers from '../controllers';
import express from 'express';

const router = express.Router();

// Endpoints for LTSA title information
router.route('/ltsa/land/title').get(controllers.getLTSA);

export default router;
