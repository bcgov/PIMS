import { Tab, Tabs } from 'components/tabs';
import { useFormikContext } from 'formik';
import { Workflow, WorkflowStatus } from 'hooks/api/projects';
import { IProjectModel } from 'hooks/api/projects/disposals';
import React from 'react';
import { Spinner } from 'react-bootstrap';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import {
  ProjectInformationTabs,
  ProjectERPTabs,
  ProjectDocumentation,
  ProjectSPLTabs,
  ProjectCloseOut,
  ProjectNotifications,
  ProjectNotSPL,
} from '.';

import * as styled from './styled';
import { useKeycloakWrapper } from 'hooks/useKeycloakWrapper';
import { Claim } from 'hooks/api';

export interface IProjectTabProps {
  project?: IProjectModel;
  isLoading?: boolean;
}

export const ProjectTabs: React.FC<IProjectTabProps> = ({ project, isLoading }) => {
  const {
    values: { workflowCode, statusCode },
  } = useFormikContext();
  const keycloak = useKeycloakWrapper();
  const location = useLocation();
  const id = location.pathname.split('/')[3];

  const [tabs, setTabs] = React.useState<React.ReactElement[]>([]);
  const [disabled, setDisabled] = React.useState(false);

  const isAdmin = keycloak.hasClaim(Claim.ReportsSplAdmin);

  React.useEffect(() => {
    const tabs = [
      <Tab key={1} label="Information" path={`/projects/disposal/${id}/information`} />,
      <Tab key={2} label="Documentation" path={`/projects/disposal/${id}/documentation`} />,
    ];

    setDisabled(
      [
        WorkflowStatus.Disposed,
        WorkflowStatus.Cancelled,
        WorkflowStatus.TransferredGRE,
        WorkflowStatus.Denied,
      ].includes(statusCode) && !isAdmin,
    );

    if (
      workflowCode === Workflow.ERP ||
      workflowCode === Workflow.ASSESS_EXEMPTION ||
      workflowCode === Workflow.ASSESS_EX_DISPOSAL ||
      !project?.statusHistory?.some(s => s.workflow === Workflow.SUBMIT_DISPOSAL) ||
      project?.statusHistory?.some(s => s.workflow === Workflow.ERP) ||
      project?.statusHistory?.some(s => s.workflow === Workflow.ASSESS_EX_DISPOSAL)
    )
      tabs.push(
        <Tab key={3} label="Enhanced Referral Program" path={`/projects/disposal/${id}/erp`} />,
      );

    if (
      statusCode === WorkflowStatus.NotInSpl ||
      !project?.statusHistory?.some(s => s.workflow === Workflow.SUBMIT_DISPOSAL) ||
      project?.statusHistory?.some(s => s.status === WorkflowStatus.NotInSpl)
    )
      tabs.push(<Tab key={4} label="Not in SPL" path={`/projects/disposal/${id}/not/spl`} />);

    if (
      workflowCode === Workflow.SPL ||
      !project?.statusHistory?.some(s => s.workflow === Workflow.SUBMIT_DISPOSAL) ||
      project?.statusHistory?.some(s => s.workflow === Workflow.SPL)
    ) {
      tabs.push(
        <Tab key={5} label="Surplus Properties List" path={`/projects/disposal/${id}/spl`} />,
      );
    }

    if (statusCode === WorkflowStatus.Disposed || workflowCode === Workflow.SPL)
      tabs.push(<Tab key={6} label="Close Out Form" path={`/projects/disposal/${id}/close/out`} />);

    tabs.push(
      <Tab key={7} label="Notifications" path={`/projects/disposal/${id}/notifications`} />,
    );
    setTabs(tabs);
  }, [workflowCode, statusCode, id, project?.statusHistory, isAdmin]);

  return (
    <styled.ProjectTabs className="project-tabs">
      {isLoading && (
        <div className="loading">
          <Spinner animation="border"></Spinner>
        </div>
      )}

      <Tabs tabs={tabs}>
        <Switch>
          <Route exact path="/projects/disposal">
            <Redirect to={`/page-not-found`} />
          </Route>
          <Route exact path="/projects/disposal/:id">
            {id === undefined || !!id ? (
              <Redirect to={`/projects/disposal/${id}/information`} />
            ) : (
              <Redirect to={`/page-not-found`} />
            )}
          </Route>
          <Route path="/projects/disposal/:id/information">
            <ProjectInformationTabs disabled={disabled} />
          </Route>
          <Route path="/projects/disposal/:id/documentation">
            <ProjectDocumentation disabled={disabled} />
          </Route>
          <Route path="/projects/disposal/:id/erp">
            <ProjectERPTabs project={project} disabled={disabled} />
          </Route>
          <Route path="/projects/disposal/:id/not/spl">
            <ProjectNotSPL disabled={disabled} />
          </Route>
          <Route path="/projects/disposal/:id/spl">
            <ProjectSPLTabs project={project} disabled={disabled} />
          </Route>
          <Route path="/projects/disposal/:id/close/out">
            <ProjectCloseOut />
          </Route>
          <Route path="/projects/disposal/:id/notifications">
            <ProjectNotifications />
          </Route>
        </Switch>
      </Tabs>
    </styled.ProjectTabs>
  );
};
