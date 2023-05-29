import { FastCurrencyInput, FastDatePicker, Input, TextArea } from 'components/common/form';
import { Col, Row } from 'components/flex';
import { useFormikContext } from 'formik';
import { Claim } from 'hooks/api';
import { WorkflowStatus } from 'hooks/api/projects';
import { useKeycloakWrapper } from 'hooks/useKeycloakWrapper';
import React, { useEffect, useState } from 'react';

import { IProjectForm } from '../interfaces';
import * as styled from './styled';

export const ProjectSPLContractInPlace: React.FC = () => {
  const formik = useFormikContext<IProjectForm>();

  // Disabled prop
  const { values }: any = useFormikContext();
  const { workflowCode, statusCode } = values;
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
    <styled.ProjectSPL>
      <h2>Contract In Place</h2>
      <Row>
        <Col flex="1">
          <TextArea label="Offers Received" field="offersNote" disabled={disabled} />
        </Col>
        <Col flex="1">
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
      </Row>
    </styled.ProjectSPL>
  );
};
