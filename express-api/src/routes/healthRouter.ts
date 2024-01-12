import controllers from '@/controllers';
import express from 'express';

const router = express.Router();

// Health-check endpoints
router.route('/').get(controllers.healthCheck);

export default router;
