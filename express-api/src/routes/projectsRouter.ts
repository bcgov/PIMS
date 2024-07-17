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
  requestProjectStatusChange,
  getAllProjectReports,
  getProjectReport,
  updateProjectReport,
  deleteProjectReport,
  addProjectReport,
  getProjectReportSnapshots,
  generateProjectReportSnapshots,
  refreshProjectSnapshots,
  getAllProjectStatus,
  getProjectStatusTasks,
  getProjectWorkflowStatuses,
  getProjectWorkflowTasks,
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
router
  .route(`${PROJECT_DISPOSAL}/workflows`)
  .put(activeUserCheck, catchErrors(requestProjectStatusChange));

router.route(`${PROJECT_REPORTS}`).get(activeUserCheck, catchErrors(getAllProjectReports));
router
  .route(`${PROJECT_REPORTS}/:reportId`)
  .get(activeUserCheck, catchErrors(getProjectReport))
  .put(activeUserCheck, catchErrors(updateProjectReport))
  .delete(activeUserCheck, catchErrors(deleteProjectReport));
router.route(`${PROJECT_REPORTS}`).post(activeUserCheck, catchErrors(addProjectReport));

router
  .route(`${PROJECT_REPORTS}/snapshots/:reportId`)
  .get(activeUserCheck, catchErrors(getProjectReportSnapshots))
  .post(activeUserCheck, catchErrors(generateProjectReportSnapshots));

router
  .route(`${PROJECT_REPORTS}/refresh/:reportId`)
  .get(activeUserCheck, catchErrors(refreshProjectSnapshots));

//Omitting search endpoints.
router.route('/').get(activeUserCheck, catchErrors(getProjects));
router.route(`/projects/status`).get(activeUserCheck, catchErrors(getAllProjectStatus));
router
  .route(`/projects/status/:statusCode/tasks`)
  .get(activeUserCheck, catchErrors(getProjectStatusTasks));
router
  .route(`/projects/workflows/:workflowCode/status`)
  .get(activeUserCheck, catchErrors(getProjectWorkflowStatuses));
router
  .route(`/projects/workflows/:workflowCode/tasks`)
  .get(activeUserCheck, catchErrors(getProjectWorkflowTasks));

export default router;
