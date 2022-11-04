import { Col } from 'components/flex';
import { Tab, Tabs } from 'components/tabs';
import { useFormikContext } from 'formik';
import { Workflow, WorkflowStatus } from 'hooks/api/projects';
import { IProjectModel } from 'hooks/api/projects/disposals';
import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';

import { ProjectERPApproval, ProjectERPComplete, ProjectERPDisposed, ProjectERPExemption } from '.';

interface IProjectERPTabsProps {
  project?: IProjectModel;
  disabled?: boolean;
}

export const ProjectERPTabs: React.FC<IProjectERPTabsProps> = ({ project, disabled = false }) => {
  const {
    values: { workflowCode, statusCode },
  } = useFormikContext();
  const location = useLocation();
  const id = location.pathname.split('/')[3];

  const [tabs, setTabs] = React.useState<React.ReactElement[]>([]);

  React.useEffect(() => {
    const tabs = [<Tab key={1} label="Approval" path={`/projects/disposal/${id}/erp`} exact />];

    if (
      project?.statusHistory?.some(s => s.workflow === Workflow.ASSESS_EX_DISPOSAL) ||
      !project?.statusHistory?.some(s => s.workflow === Workflow.SUBMIT_DISPOSAL) ||
      statusCode === WorkflowStatus.ApprovedForExemption
    )
      tabs.push(
        <Tab key={2} label="Exemption" path={`/projects/disposal/${id}/erp/exemption`} exact />,
      );

    tabs.push(
      <Tab key={3} label="Complete" path={`/projects/disposal/${id}/erp/complete`} exact />,
    );

    if (statusCode !== WorkflowStatus.NotInSpl && workflowCode !== Workflow.SPL)
      tabs.push(
        <Tab key={4} label="Disposed" path={`/projects/disposal/${id}/erp/disposed`} exact />,
      );

    setTabs(tabs);
  }, [workflowCode, statusCode, id, project?.statusHistory]);

  return (
    <Col>
      <Tabs tabs={tabs}>
        <Switch>
          <Route exact path="/projects/disposal/:id/erp">
            <ProjectERPApproval disabled={disabled} />
          </Route>
          <Route path="/projects/disposal/:id/erp/exemption">
            <ProjectERPExemption disabled={disabled} />
          </Route>
          <Route path="/projects/disposal/:id/erp/complete">
            <ProjectERPComplete disabled={disabled} />
          </Route>
          <Route path="/projects/disposal/:id/erp/disposed">
            <ProjectERPDisposed disabled={disabled} />
          </Route>
        </Switch>
      </Tabs>
    </Col>
  );
};
