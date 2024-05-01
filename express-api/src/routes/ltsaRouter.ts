import controllers from '@/controllers';
import activeUserCheck from '@/middleware/activeUserCheck';
import catchErrors from '@/utilities/controllerErrorWrapper';
import express from 'express';

const router = express.Router();

// Endpoints for LTSA title information
router.route('/land/title').get(activeUserCheck, catchErrors(controllers.getToken));

export default router;
