import React from 'react';
import { Tab, Tabs } from 'components/tabs';
import { Switch, Route, useLocation } from 'react-router-dom';
import {
  ProjectERPApproval,
  ProjectERPExemption,
  ProjectERPComplete,
  AgencyInterest,
  ProjectERPDisposed,
} from '.';
import { Col } from 'components/flex';
import { useFormikContext } from 'formik';
import { Workflow, WorkflowStatus } from 'hooks/api/projects';
import { IProjectModel } from 'hooks/api/projects/disposals';

interface IProjectERPTabsProps {
  project?: IProjectModel;
}

export const ProjectERPTabs: React.FC<IProjectERPTabsProps> = ({ project }) => {
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
          <Route exact path="/projects/disposal/:id/erp" component={ProjectERPApproval} />
          <Route path="/projects/disposal/:id/erp/exemption" component={ProjectERPExemption} />
          <Route path="/projects/disposal/:id/erp/complete" component={ProjectERPComplete} />
          <Route path="/projects/disposal/:id/erp/disposed" component={ProjectERPDisposed} />
        </Switch>
      </Tabs>
      <AgencyInterest />
    </Col>
  );
};
