import React from 'react';
import { ProjectListView } from '.';

/**
 * A list view paging table to search for projects that have been submitted for assessment.
 * @returns ProjectApprovalRequestListView component.
 */
export const ProjectApprovalRequestListView = () => {
  console.info('test');
  return (
    <ProjectListView
      filterable={false}
      title="Surplus Property Program Projects - Approval Requests"
      defaultFilter={{ statusId: ['7', '8'] }}
    />
  );
};

export default ProjectApprovalRequestListView;
