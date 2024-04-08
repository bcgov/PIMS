import { Roles } from '@/constants/roles';
import controllers from '@/controllers';
import catchErrors from '@/utilities/controllerErrorWrapper';
import { protectedRoute } from '@bcgov/citz-imb-kc-express';
import express from 'express';

const router = express.Router();

const { addRole, deleteRoleById, getRoleById, getRoles, updateRoleById } = controllers;

// Endpoints for Roles
router.route(`/`).get(catchErrors(getRoles)).post(catchErrors(addRole));

router
  .route(`/:id`)
  .get(catchErrors(getRoleById))
  .put(protectedRoute([Roles.ADMIN]), catchErrors(updateRoleById)) // TODO: should put be a patch?
  .delete(protectedRoute([Roles.ADMIN]), catchErrors(deleteRoleById));

export default router;
