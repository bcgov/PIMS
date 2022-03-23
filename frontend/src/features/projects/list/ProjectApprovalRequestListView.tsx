import React from 'react';
import { ProjectListView } from '.';

/**
 * A list view paging table to search for projects that have been submitted for assessment.
 * @returns ProjectApprovalRequestListView component.
 */

interface IProjectFilterState {
  name?: string;
  statusId?: string[];
  agencyId?: string;
  agencies?: number[];
  fiscalYear?: number | '';
}

const initialValues: IProjectFilterState = {
  name: '',
  statusId: ['7', '8'],
  agencyId: '',
  agencies: [],
  fiscalYear: '',
};

export const ProjectApprovalRequestListView = () => {
  console.info('test');
  return (
    <ProjectListView
      filterable={false}
      title="Surplus Property Program Projects - Approval Requests"
      defaultFilter={initialValues}
    />
  );
};

export default ProjectApprovalRequestListView;
