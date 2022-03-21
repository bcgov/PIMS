import React from 'react';
import { ProjectListView } from '.';

/**
 * A list view paging table to search for projects that have been submitted for assessment.
 * @returns SPLProjectListView component.
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
  statusId: ['21', '40', '41', '42', '43'],
  agencyId: '',
  agencies: [],
  fiscalYear: '',
};

export const SPLProjectListView = () => {
  return (
    <ProjectListView
      filterable={true}
      title="Surplus Property Program Projects - SPL Projects"
      defaultFilter={initialValues}
    />
  );
};

export default SPLProjectListView;
