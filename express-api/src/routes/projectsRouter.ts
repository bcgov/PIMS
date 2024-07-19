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

//This originally had like 3 different routes that all seem to do the same thing so let's just consolidate that to one.
router.route(`${PROJECT_DISPOSAL}/workflows`);

router.route(`${PROJECT_REPORTS}/:reportId`);

router.route(`${PROJECT_REPORTS}/snapshots/:reportId`);

router.route(`${PROJECT_REPORTS}/refresh/:reportId`);

//Omitting search endpoints.
router.route('/').get(activeUserCheck, catchErrors(getProjects));
router.route(`/projects/status/:statusCode/tasks`);
router.route(`/projects/workflows/:workflowCode/status`);
router.route(`/projects/workflows/:workflowCode/tasks`);

export default router;
