import { Col } from 'components/flex';
import { Tab, Tabs } from 'components/tabs';
import { useFormikContext } from 'formik';
import { Workflow, WorkflowStatus } from 'hooks/api/projects';
import { IProjectModel } from 'hooks/api/projects/disposals';
import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';

import {
  ProjectSPLApproval,
  ProjectSPLContractInPlace,
  ProjectSPLMarketing,
  ProjectSPLTransferWithinGRE,
} from '.';

interface IProjectSPLTabsProps {
  project?: IProjectModel;
  disabled?: boolean;
}

export const ProjectSPLTabs: React.FC<IProjectSPLTabsProps> = ({ project, disabled = false }) => {
  const {
    values: { workflowCode, statusCode },
  } = useFormikContext();
  const location = useLocation();
  const id = location.pathname.split('/')[3];

  const [tabs, setTabs] = React.useState<React.ReactElement[]>([]);

  React.useEffect(() => {
    const tabs = [<Tab key={1} label="Approval" path={`/projects/disposal/${id}/spl`} exact />];
    if (
      workflowCode === Workflow.SPL ||
      project?.statusHistory?.some(s => s.status === WorkflowStatus.PreMarketing) ||
      !project?.statusHistory?.some(s => s.workflow === Workflow.SUBMIT_DISPOSAL)
    )
      tabs.push(
        <Tab key={2} label="Marketing" path={`/projects/disposal/${id}/spl/marketing`} exact />,
      );

    if (
      workflowCode === Workflow.SPL ||
      project?.statusHistory?.some(s => s.status === WorkflowStatus.OnMarket) ||
      !project?.statusHistory?.some(s => s.workflow === Workflow.SUBMIT_DISPOSAL)
    )
      tabs.push(
        <Tab
          key={3}
          label="Contract In Place"
          path={`/projects/disposal/${id}/spl/contract/in/place`}
          exact
        />,
      );

    if (workflowCode === Workflow.SPL || statusCode === WorkflowStatus.TransferredGRE)
      tabs.push(
        <Tab
          key={4}
          label="Transfer within GRE"
          path={`/projects/disposal/${id}/spl/transfer/within/gre`}
          exact
        />,
      );

    setTabs(tabs);
  }, [workflowCode, statusCode, id, project?.statusHistory]);

  return (
    <Col>
      <Tabs tabs={tabs}>
        <Switch>
          <Route exact path="/projects/disposal/:id/spl">
            <ProjectSPLApproval disabled={disabled} />
          </Route>
          <Route path="/projects/disposal/:id/spl/marketing">
            <ProjectSPLMarketing disabled={disabled} />
          </Route>
          <Route path="/projects/disposal/:id/spl/contract/in/place">
            <ProjectSPLContractInPlace disabled={disabled} />
          </Route>
          <Route path="/projects/disposal/:id/spl/transfer/within/gre">
            <ProjectSPLTransferWithinGRE disabled={disabled} />
          </Route>
        </Switch>
      </Tabs>
    </Col>
  );
};
