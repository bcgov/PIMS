import controllers from '@/controllers';
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
} = controllers;

//These originally had a separate route for numeric id and projectNumber, but I don't think express supports this pattern.
router
  .route(`${PROJECT_DISPOSAL}/:projectId`)
  .get(catchErrors(getDisposalProject))
  .put(catchErrors(updateDisposalProject))
  .delete(catchErrors(deleteDisposalProject));
router.route(`${PROJECT_DISPOSAL}`).post(catchErrors(addDisposalProject));

//This originally had like 3 different routes that all seem to do the same thing so let's just consolidate that to one.
router.route(`${PROJECT_DISPOSAL}/workflows`).put(catchErrors(requestProjectStatusChange));

router.route(`${PROJECT_REPORTS}`).get(catchErrors(getAllProjectReports));
router
  .route(`${PROJECT_REPORTS}/:reportId`)
  .get(catchErrors(getProjectReport))
  .put(catchErrors(updateProjectReport))
  .delete(catchErrors(deleteProjectReport));
router.route(`${PROJECT_REPORTS}`).post(catchErrors(addProjectReport));

router.route(`${PROJECT_REPORTS}/snapshots/:reportId`).get(catchErrors(getProjectReportSnapshots));
router
  .route(`${PROJECT_REPORTS}/snapshots/:reportId`)
  .post(catchErrors(generateProjectReportSnapshots));

router.route(`${PROJECT_REPORTS}/refresh/:reportId`).get(catchErrors(refreshProjectSnapshots));

//Omitting search endpoints.

router.route(`/projects/status`).get(catchErrors(getAllProjectStatus));
router.route(`/projects/status/:statusCode/tasks`).get(catchErrors(getProjectStatusTasks));
router
  .route(`/projects/workflows/:workflowCode/status`)
  .get(catchErrors(getProjectWorkflowStatuses));
router.route(`/projects/workflows/:workflowCode/tasks`).get(catchErrors(getProjectWorkflowTasks));

export default router;
