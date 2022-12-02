import { Tab, Tabs } from 'components/tabs';
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import * as styled from './styled';

interface IProjectInformationProps {
  disabled?: boolean;
}

export const ProjectInformationTabs: React.FC<IProjectInformationProps> = ({
  disabled = false,
}) => {
  const location = useLocation();

  const id = location.pathname.split('/')[3];

  return (
    <styled.ProjectInformation>
      <Tabs
        tabs={[
          <Tab key={1} label="Project" path={`/projects/disposal/${id}/information`} exact />,
          <Tab
            key={2}
            label="Properties"
            path={`/projects/disposal/${id}/information/properties`}
            exact
          />,
        ]}
      >
        <Outlet />
      </Tabs>
    </styled.ProjectInformation>
  );
};
