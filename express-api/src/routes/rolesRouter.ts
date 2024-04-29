import { Roles } from '@/constants/roles';
import controllers from '@/controllers';
import activeUserCheck from '@/middleware/activeUserCheck';
import catchErrors from '@/utilities/controllerErrorWrapper';
import { protectedRoute } from '@bcgov/citz-imb-sso-express';
import express from 'express';

const router = express.Router();

const { addRole, deleteRoleById, getRoleById, getRoles, updateRoleById } = controllers;

// Endpoints for Roles
router.route(`/`).get(catchErrors(getRoles)).post(activeUserCheck, catchErrors(addRole));

router
  .route(`/:id`)
  .get(catchErrors(getRoleById))
  .put(protectedRoute([Roles.ADMIN]), activeUserCheck, catchErrors(updateRoleById)) // TODO: should put be a patch?
  .delete(protectedRoute([Roles.ADMIN]), activeUserCheck, catchErrors(deleteRoleById));

export default router;
