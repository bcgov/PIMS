import controllers from '@/controllers';
import catchErrors from '@/utilities/controllerErrorWrapper';
import express from 'express';

const router = express.Router();

// Health-check endpoints
router.route('/').get(catchErrors(controllers.healthCheck));

export default router;
