import controllers from '@/controllers';
import catchErrors from '@/utilities/controllerErrorWrapper';
import express from 'express';

const router = express.Router();

const { submitErrorReport } = controllers;

// For errors submitted by the frontend Error Boundary.
router.route('/error').post(catchErrors(submitErrorReport));

export default router;
