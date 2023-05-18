import { Col } from 'components/flex';
import { Tab, Tabs } from 'components/tabs';
import { useFormikContext } from 'formik';
import { Workflow, WorkflowStatus } from 'hooks/api/projects';
import { IProjectModel } from 'hooks/api/projects/disposals';
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

interface IProjectSPLTabsProps {
  project?: IProjectModel;
}

export const ProjectSPLTabs: React.FC<IProjectSPLTabsProps> = ({ project }) => {
  const { values }: any = useFormikContext();
  const { workflowCode, statusCode } = values;
  const location = useLocation();
  const id = location.pathname.split('/')[3];

  const [tabs, setTabs] = React.useState<React.ReactElement[]>([]);

  React.useEffect(() => {
    const tabs = [<Tab key={1} label="Approval" path={`/projects/disposal/${id}/spl`} exact />];
    if (
      workflowCode === Workflow.SPL ||
      project?.statusHistory?.some((s) => s.status === WorkflowStatus.PreMarketing) ||
      !project?.statusHistory?.some((s) => s.workflow === Workflow.SUBMIT_DISPOSAL)
    )
      tabs.push(
        <Tab key={2} label="Marketing" path={`/projects/disposal/${id}/spl/marketing`} exact />,
      );

    if (
      workflowCode === Workflow.SPL ||
      project?.statusHistory?.some((s) => s.status === WorkflowStatus.OnMarket) ||
      !project?.statusHistory?.some((s) => s.workflow === Workflow.SUBMIT_DISPOSAL)
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
        <Outlet />
      </Tabs>
    </Col>
  );
};
