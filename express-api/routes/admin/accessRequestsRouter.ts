import controllers from '../../controllers';
import express from 'express';

const router = express.Router();

const { getAccessRequests, deleteAccessRequest } = controllers;

// Endpoints for Admin Access Requests
router.route('/admin/accessRequests').get(getAccessRequests).delete(deleteAccessRequest);

export default router;
