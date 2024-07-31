import controllers from '@/controllers';
import activeUserCheck from '@/middleware/activeUserCheck';
import catchErrors from '@/utilities/controllerErrorWrapper';
import express from 'express';

const router = express.Router();

export const PROJECT_DISPOSAL = '/disposal';
export const PROJECT_REPORTS = '/reports';

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
  .get(activeUserCheck, catchErrors(getDisposalProject))
  .put(activeUserCheck, catchErrors(updateDisposalProject))
  .delete(activeUserCheck, catchErrors(deleteDisposalProject));

router.route(`${PROJECT_DISPOSAL}`).post(activeUserCheck, catchErrors(addDisposalProject));

//Omitting search endpoints.
router.route('/').get(activeUserCheck, catchErrors(getProjects));

export default router;
