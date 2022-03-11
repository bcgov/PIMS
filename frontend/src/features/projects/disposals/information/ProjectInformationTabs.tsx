import React from 'react';
import * as styled from './styled';
import { ProjectInformation, ProjectProperties } from '.';
import { Tab, Tabs } from 'components/tabs';
import { Route, Switch, useLocation } from 'react-router-dom';

interface IProjectInformationProps {}

export const ProjectInformationTabs: React.FC<IProjectInformationProps> = props => {
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
        <Switch>
          <Route exact path="/projects/disposal/:id/information" component={ProjectInformation} />
          <Route
            path="/projects/disposal/:id/information/properties"
            component={ProjectProperties}
          />
        </Switch>
      </Tabs>
    </styled.ProjectInformation>
  );
};
