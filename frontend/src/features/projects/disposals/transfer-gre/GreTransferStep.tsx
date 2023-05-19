import { Button, Input, ParentSelect, TextArea } from 'components/common/form';
import GenericModal from 'components/common/GenericModal';
import { Col, Row } from 'components/flex';
import { Table } from 'components/Table';
import { useFormikContext } from 'formik';
import { WorkflowStatus } from 'hooks/api/projects';
import { IProjectModel } from 'hooks/api/projects/disposals';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LookupType, useLookups, useProjectDisposal } from 'store/hooks';

import { IProjectForm, IProjectPropertyForm } from '../interfaces';
import { toModel } from '../utils';
import { TransferPropertyColumns } from './constants';
import * as styled from './styled';

interface IGreTransferStepProps {
  project: IProjectModel;
  onUpdate: (project: IProjectModel) => void;
}

/**
 * Allows SRES users to transfer properties in a project to the purchasing agency.
 * {isReadOnly formikRef} formikRef allow remote formik access
 */
export const GreTransferStep: React.FC<IGreTransferStepProps> = ({ project, onUpdate }) => {
  const navigate = useNavigate();
  const { values, setTouched, validateForm, setFieldValue } = useFormikContext<IProjectForm>();
  const { controller } = useLookups();
  const api = useProjectDisposal();

  const [showConfirm, setShowConfirm] = React.useState(false);
  const [transferred, setTransferred] = React.useState(false);

  const agencies = controller.getOptionsWithParents(LookupType.Agency);
  const { workflowCode, properties } = values;
  const eUpdate =
    values.transferToAgencyId !== project.agencyId &&
    values.transferToAgencyId !== 0 &&
    properties.every((p) => p.classificationId <= 1);

  React.useEffect(() => {
    if (transferred) navigate(`/projects/disposal/${project?.id}`);
  }, [navigate, project?.id, transferred]);

  return (
    <styled.GreTransferStep>
      <Row>
        <Button
          onClick={() => {
            navigate(-1);
          }}
        >
          Back
        </Button>
        <h1>Transfer within the Greater Reporting Entity</h1>
      </Row>
      <Row>
        <Col flex="1">
          <Input label="Project No." field="projectNumber" disabled={true} />
          <Input label="Name" field="name" disabled={true} />
        </Col>
        <Col flex="1">
          <TextArea label="Description" field="description" />
        </Col>
      </Row>
      <p>
        Select the agency to transfer the properties to, and update each properties classification.
      </p>
      <ParentSelect
        label="Transfer to Agency"
        field="transferToAgencyId"
        options={agencies}
        filterBy={['code', 'label']}
        convertValue={Number}
        onChange={(values) => {
          setFieldValue('transferToAgencyId', !!values.length ? Number(values[0].value) : 0);
        }}
        required
      />
      <Table<IProjectPropertyForm, any>
        columns={TransferPropertyColumns()}
        name="properties"
        data={properties}
        footer={false}
      />
      <Button
        disabled={!eUpdate}
        showSubmitting
        isSubmitting={false}
        onClick={() =>
          validateForm().then((errors: any) => {
            if (Object.keys(errors).length === 0) {
              setShowConfirm(true);
            } else {
              setTouched(errors);
            }
          })
        }
      >
        Update Property Information Management System
      </Button>
      {showConfirm && (
        <GenericModal
          display={showConfirm}
          cancelButtonText="Close"
          okButtonText="Update PIMS"
          handleOk={async () => {
            // Switch all property agencies.
            project.properties = project.properties.map((p) => {
              if (p.building) {
                p.building.agency = undefined;
                p.building.agencyId = values.transferToAgencyId;
              } else if (p.parcel) {
                p.parcel.agency = undefined;
                p.parcel.agencyId = values.transferToAgencyId;
              }
              return p;
            });
            const response = await api.setStatus(
              toModel(project, values),
              workflowCode,
              WorkflowStatus.TransferredGRE,
            );
            if (response && response.status === 200) {
              onUpdate(response.data);
              setTransferred(true);
            }
            setShowConfirm(false);
          }}
          handleCancel={() => {
            setShowConfirm(false);
          }}
          title="Really Update PIMS?"
          message="Please ensure all the updated information is correct before clicking Update PIMS."
        />
      )}
    </styled.GreTransferStep>
  );
};
