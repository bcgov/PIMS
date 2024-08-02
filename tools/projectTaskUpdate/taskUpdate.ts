/**
 * This block of code can be placed within the express-api when needed for the ETL process. 
 * It should not be kept in the application after use. It is only for the ETL.
 */


/*
import { AppDataSource } from '@/appDataSource';
import { ProjectStatus } from '@/constants/projectStatus';
import { ProjectTask } from '@/constants/projectTask';
import { Project } from '@/typeorm/Entities/Project';
import { Request, Response } from 'express';
import { ProjectTask as ProjectTaskEntity } from '@/typeorm/Entities/ProjectTask';
import { UpdateResult } from 'typeorm';


const projects = await AppDataSource.getRepository(Project).find({
  relations: {
    Tasks: true,
    StatusHistory: true,
  },
});

const getNewProjectTask = (oldTaskId: ProjectTask) => {
  switch (oldTaskId) {
    case ProjectTask.APPRAISAL_ORDERED:
      return ProjectTask.APPRAISAL_ORDERED_EXEMPT;
    case ProjectTask.APPRAISAL_RECEIVED:
      return ProjectTask.APPRAISAL_RECEIVED_EXEMPT;
    case ProjectTask.DOCUMENTS_RECEIVED_REVIEW_COMPLETED:
      return ProjectTask.DOCUMENTS_RECEIVED_REVIEW_COMPLETED_EXEMPT;
    case ProjectTask.FN_CONSULTATION_COMPLETE:
      return ProjectTask.FN_CONSULTATION_COMPLETE_EXEMPT;
    case ProjectTask.FN_CONSULTATION_UNDERWAY:
      return ProjectTask.FN_CONSULTATION_UNDERWAY_EXEMPT;
    case ProjectTask.PREPARATION_DUE_DILIGENCE:
      return ProjectTask.PREPARATION_DUE_DILIGENCE_EXEMPT;
  }
};
// For each project
projects.forEach(async (project) => {
  // If it has a status history of Approved for Exemption or is currently in that status
  if (
    project.StatusId === ProjectStatus.APPROVED_FOR_EXEMPTION ||
    project.StatusHistory.some((h) => h.StatusId === ProjectStatus.APPROVED_FOR_EXEMPTION)
  ) {
    // Take tasks with Approved for ERP status id and update to have Approved for Exemption status id
    const taskIdsToChange = [
      ProjectTask.APPRAISAL_ORDERED,
      ProjectTask.APPRAISAL_RECEIVED,
      ProjectTask.DOCUMENTS_RECEIVED_REVIEW_COMPLETED,
      ProjectTask.FN_CONSULTATION_COMPLETE,
      ProjectTask.FN_CONSULTATION_UNDERWAY,
      ProjectTask.PREPARATION_DUE_DILIGENCE,
    ];
    const tasksToUpdate = project.Tasks.filter((t) => taskIdsToChange.includes(t.TaskId));
    const updatePromises: Promise<UpdateResult>[] = [];
    tasksToUpdate.forEach((t) => {
      updatePromises.push(
        AppDataSource.getRepository(ProjectTaskEntity).update(
          {
            TaskId: t.TaskId,
            ProjectId: t.ProjectId,
          },
          {
            TaskId: getNewProjectTask(t.TaskId),
          },
        ),
      );
    });
    await Promise.all(updatePromises);
  }
});
*/
