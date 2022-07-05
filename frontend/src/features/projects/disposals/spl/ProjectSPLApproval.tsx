import { FastDatePicker, TextArea } from 'components/common/form';
import { useFormikContext } from 'formik';
import { Workflow } from 'hooks/api/projects';
import React from 'react';
import { Col, Row } from 'react-bootstrap';

import { IProjectForm } from '../interfaces';
import * as styled from './styled';

interface IProjectSPLApprovalProps {
  disabled?: boolean;
}

export const ProjectSPLApproval: React.FC<IProjectSPLApprovalProps> = ({ disabled = false }) => {
  const formik = useFormikContext<IProjectForm>();
  const {
    setFieldTouched,
    values: { workflowCode },
  } = formik;

  React.useEffect(() => {
    setFieldTouched('removalFromSplRequestOn');
    setFieldTouched('removalFromSplApprovedOn');
    setFieldTouched('removalFromSplRationale');
  }, [setFieldTouched]);

  const showNotInSpl = [Workflow.SPL].includes(workflowCode as Workflow);

  return (
    <styled.ProjectSPL>
      <Row>
        <Col>
          <h2>Approval</h2>
          <FastDatePicker
            label="Request for Addition to SPL Received"
            field="requestForSplReceivedOn"
            formikProps={formik}
            size="sm"
            disabled={disabled}
          />
          <FastDatePicker
            label="Addition Approved"
            field="approvedForSplOn"
            formikProps={formik}
            size="sm"
            disabled={disabled}
          />
        </Col>
        {showNotInSpl && (
          <Col>
            <h2>Removal from SPL</h2>
            <FastDatePicker
              label="Requested On"
              field="removalFromSplRequestOn"
              formikProps={formik}
              size="sm"
              disabled={disabled}
            />
            <FastDatePicker
              label="Approved On"
              field="removalFromSplApprovedOn"
              formikProps={formik}
              size="sm"
              disabled={disabled}
            />
            <TextArea label="Rationale" field="removalFromSplRationale" disabled={disabled} />
          </Col>
        )}
      </Row>
    </styled.ProjectSPL>
  );
};
