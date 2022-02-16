import React from 'react';

import { ProjectListView } from '.';

/**
 * A list view paging table to search for projects that have been submitted for assessment.
 * @returns SPLProjectListView component.
 */

export const SPLProjectListView = () => {
  console.info('test');
  return (
    <ProjectListView
      filterable={false}
      title="Surplus Property Program Projects - SPL Projects"
      defaultFilter={{ statusId: '21,40,41,42,43' }}
    />
  );
};

export default SPLProjectListView;
