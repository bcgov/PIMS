import { Button, Check } from 'components/common/form';
import GenericModal from 'components/common/GenericModal';
import { Col, Row } from 'components/flex';
import { useFormikContext } from 'formik';
import { WorkflowStatus } from 'hooks/api/projects';
import { IProjectModel } from 'hooks/api/projects/disposals';
import { IProjectStatusModel } from 'hooks/api/projects/workflows';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectDisposal, useProjectWorkflow } from 'store';

import { IProjectForm } from './interfaces';
import * as styled from './styled';
import { toModel } from './utils';

export interface IProjectStatusProps {
  project?: IProjectModel;
  onUpdate: (project: IProjectModel) => void;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ProjectStatus: React.FC<IProjectStatusProps> = ({
  project,
  onUpdate,
  isSubmitting,
  setIsSubmitting,
}) => {
  const navigate = useNavigate();
  const { values, validateForm } = useFormikContext<IProjectForm>();
  const apiWorkflow = useProjectWorkflow();
  const api = useProjectDisposal();

  const [statusInfo, setStatusInfo] = React.useState<IProjectStatusModel>();
  const [workflow, setWorkflow] = React.useState(project?.workflowCode);
  const [options, setOptions] = React.useState<IProjectStatusModel[]>([]);
  const workflowCode = project?.workflowCode;
  const status = options.find(
    (o) => o.workflowCode === project?.workflowCode && o.code === project?.statusCode,
  );

  React.useEffect(() => {
    if (workflowCode && (workflowCode !== workflow || options.length === 0)) {
      setWorkflow(workflowCode);
      apiWorkflow.getStatusFor(workflowCode).then((response) => {
        setOptions(response?.data ?? []);
      });
    }
  }, [apiWorkflow, options.length, workflow, workflowCode]);

  const updateStatus = async (workflowCode: string, statusCode: string) => {
    const errors = await validateForm({
      ...values,
      workflowCode,
      statusCode,
    });
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      try {
        if (statusCode !== WorkflowStatus.TransferredGRE) {
          const response = await api.setStatus(toModel(project, values), workflowCode, statusCode);
          if (response && response.status === 200) onUpdate(response.data);
        } else {
          const response = await api.update(toModel(project, values));
          if (response && response.status === 200) {
            onUpdate(response.data);
            navigate(`/projects/disposal/${project?.id}/transfer/within/gre`);
          }
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Remove duplicate actions, but keep the one for the current workflow.
  // TODO: Not certain this is the best way to remove duplicate actions.
  const actions = status?.toStatus
    .filter(
      (s, i) =>
        !status.toStatus.find((ts, ti) => ts.code === s.code && ti !== i) ||
        s.workflowCode === project?.workflowCode,
    )
    .sort((a, b) => {
      if (a.code === WorkflowStatus.Cancelled) return 1;
      if (a.sortOrder < b.sortOrder) return -1;
      if (a.sortOrder < b.sortOrder) return 1;
      return 0;
    })
    .map((status) => {
      return (
        <Button
          data-testid={`project-status-${status?.name}-btn`}
          key={`${status.workflowCode}-${status.id}`}
          variant={status.code === WorkflowStatus.Cancelled ? 'danger' : 'secondary'}
          isSubmitting={isSubmitting}
          onClick={() => {
            setStatusInfo(status);
          }}
        >
          {status.name}
        </Button>
      );
    });

  return project ? (
    <styled.ProjectStatus columnGap="0.25em">
      <Row rowGap="0.25em">
        <styled.ActiveStatus flex="0.75">
          <span>Status</span>
          <span>
            {![
              WorkflowStatus.ApprovedForExemption,
              WorkflowStatus.Disposed,
              WorkflowStatus.NotInSpl,
            ].includes(status?.code as WorkflowStatus) && (
              <p className="workflow">{status?.workflowCode}</p>
            )}
            <b>{status?.name}</b>
          </span>
        </styled.ActiveStatus>
        <Col flex="4">
          <Row className="status">{actions}</Row>
        </Col>
      </Row>
      {!!statusInfo && (
        <GenericModal
          data-testid="change-status-btn"
          display={!!statusInfo}
          cancelButtonText="Close"
          okButtonText="Change Status"
          handleOk={async () => {
            updateStatus(statusInfo?.workflowCode, statusInfo?.code);
            setStatusInfo(undefined);
          }}
          handleCancel={() => {
            setStatusInfo(undefined);
          }}
          title={statusInfo.name}
          message={
            <div>
              <p>This action will change the status of the project.</p>
              <h4>Status Description:</h4>
              <p>{statusInfo.description}</p>
              {statusInfo.code === WorkflowStatus.ApprovedForErp && (
                <div>
                  <Check field={`sendNotifications`} postLabel="Send notifications" />
                  <p>If notifications should not be sent for ERP, disable 'Send Notifications'.</p>
                </div>
              )}
            </div>
          }
        />
      )}
    </styled.ProjectStatus>
  ) : (
    <></>
  );
};
