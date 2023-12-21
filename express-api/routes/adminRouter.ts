import controllers from '../controllers';
import express from 'express';

const router = express.Router();

const { getAccessRequests, deleteAccessRequest } = controllers;

const ADMIN_ROUTE = '/admin';

// Endpoints for Admin Access Requests
router.route(`${ADMIN_ROUTE}/accessRequests`).get(getAccessRequests).delete(deleteAccessRequest);

export default router;
