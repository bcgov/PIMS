import controllers from '@/controllers';
import express from 'express';

const router = express.Router();

export const PROJECT_DISPOSAL = '/projects/disposal';
export const PROJECT_REPORTS = '/projects/reports';

//These originally had a separate route for numeric id and projectNumber, but I don't think express supports this pattern.
router.route(`${PROJECT_DISPOSAL}/:projectId`).get(controllers.getDisposalProject);
router.route(`${PROJECT_DISPOSAL}/:projectId`).put(controllers.updateDisposalProject);
router.route(`${PROJECT_DISPOSAL}/:projectId`).delete(controllers.deleteDisposalProject);
router.route(`${PROJECT_DISPOSAL}`).post(controllers.addDisposalProject);

//This originally had like 3 different routes that all seem to do the same thing so let's just consolidate that to one.
router.route(`${PROJECT_DISPOSAL}/workflows`).put(controllers.requestProjectStatusChange);

router.route(`${PROJECT_REPORTS}`).get(controllers.getAllProjectReports);
router.route(`${PROJECT_REPORTS}/:reportId`).get(controllers.getProjectReport);
router.route(`${PROJECT_REPORTS}/:reportId`).put(controllers.updateProjectReport);
router.route(`${PROJECT_REPORTS}/:reportId`).delete(controllers.deleteProjectReport);
router.route(`${PROJECT_REPORTS}/:reportId`).post(controllers.addProjectReport);

router.route(`${PROJECT_REPORTS}/snapshots/:reportId`).get(controllers.getProjectReportSnapshots);
router
  .route(`${PROJECT_REPORTS}/snapshots/:reportId`)
  .post(controllers.generateProjectReportSnapshots);

router.route(`${PROJECT_REPORTS}/refresh/:reportId`).get(controllers.refreshProjectSnapshots);

//Omitting search endpoints.

router.route(`/projects/status`).get(controllers.getAllProjectStatus);
router.route(`/projects/status/:statusCode/tasks`).get(controllers.getProjectStatusTasks);
router
  .route(`/projects/workflows/:workflowCode/status`)
  .get(controllers.getProjectWorkflowStatuses);
router.route(`/projects/workflows/:workflowCode/tasks`).get(controllers.getProjectWorkflowTasks);

export default router;
