import { Roles } from '@/constants/roles';
import controllers from '@/controllers';
import userAuthCheck from '@/middleware/userAuthCheck';
import catchErrors from '@/utilities/controllerErrorWrapper';
import express from 'express';

const router = express.Router();

export const PROJECT_DISPOSAL = '/disposal';

const {
  getDisposalProject,
  updateDisposalProject,
  deleteDisposalProject,
  addDisposalProject,
  getProjects,
} = controllers;

//These originally had a separate route for numeric id and projectNumber, but I don't think express supports this pattern.
router
  .route(`${PROJECT_DISPOSAL}/:projectId`)
  .get(userAuthCheck(), catchErrors(getDisposalProject))
  .put(userAuthCheck({ requiredRoles: [Roles.ADMIN] }), catchErrors(updateDisposalProject))
  .delete(userAuthCheck({ requiredRoles: [Roles.ADMIN] }), catchErrors(deleteDisposalProject));

router.route(`${PROJECT_DISPOSAL}`).post(userAuthCheck(), catchErrors(addDisposalProject));

//Omitting search endpoints.
router.route('/').get(userAuthCheck(), catchErrors(getProjects));

export default router;
