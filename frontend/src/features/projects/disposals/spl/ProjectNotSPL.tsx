import { FastCurrencyInput, FastDatePicker, Input, TextArea } from 'components/common/form';
import { Col, Row } from 'components/flex';
import { useFormikContext } from 'formik';
import { Claim } from 'hooks/api';
import { WorkflowStatus } from 'hooks/api/projects';
import { useKeycloakWrapper } from 'hooks/useKeycloakWrapper';
import React, { useEffect, useState } from 'react';

import { IProjectForm } from '../interfaces';
import * as styled from './styled';

export const ProjectNotSPL: React.FC = () => {
  const formik = useFormikContext<IProjectForm>();
  const { values }: any = useFormikContext();
  const { workflowCode, statusCode } = values;

  const showTransferredWithinGRE =
    statusCode === WorkflowStatus.NotInSpl || statusCode === WorkflowStatus.TransferredGRE;

  // Disabled prop
  const keycloak = useKeycloakWrapper();
  const [disabled, setDisabled] = useState(false);
  const isAdmin = keycloak.hasClaim(Claim.ReportsSplAdmin);

  useEffect(() => {
    setDisabled(
      [
        WorkflowStatus.Disposed,
        WorkflowStatus.Cancelled,
        WorkflowStatus.TransferredGRE,
        WorkflowStatus.Denied,
      ].includes(statusCode) && !isAdmin,
    );
  }, [isAdmin, workflowCode, statusCode]);

  return (
    <styled.ProjectNotSPL>
      <h2>Not in Surplus Properties List</h2>
      <Row>
        <Col flex="1">
          <TextArea label="Offers Received" field="offersNote" disabled={disabled} />
          <Input label="Purchaser" field="purchaser" disabled={disabled} />
          <FastCurrencyInput
            label="Offer Amount"
            field="offerAmount"
            formikProps={formik}
            disabled={disabled}
          />
          <FastDatePicker
            label="Date of Accepted Offer"
            field="offerAcceptedOn"
            formikProps={formik}
            size="sm"
            disabled={disabled}
          />
          <FastDatePicker
            label="Disposal Date"
            field="disposedOn"
            formikProps={formik}
            size="sm"
            disabled={disabled}
          />
        </Col>
        <Col flex="1" align="flex-end">
          {showTransferredWithinGRE && (
            <FastDatePicker
              label="Transferred within the GRE On"
              field="transferredWithinGreOn"
              formikProps={formik}
              size="sm"
              disabled={disabled}
            />
          )}
        </Col>
      </Row>
    </styled.ProjectNotSPL>
  );
};
