import { Button } from 'components/common/form';
import { Col, Row } from 'components/flex';
import { useFormikContext } from 'formik';
import { Claim } from 'hooks/api';
import { WorkflowStatus } from 'hooks/api/projects';
import { ISearchPropertyModel } from 'hooks/api/properties/search';
import { useKeycloakWrapper } from 'hooks/useKeycloakWrapper';
import React, { useEffect, useState } from 'react';

import { IProjectForm } from '../interfaces';
import { DisplayError } from './../../../../components/common/form/DisplayError';
import { PropertyListViewUpdate } from './../../common/components/PropertyListViewUpdate';
import { ProjectAddProperties } from '.';
import { ProjectPropertyInformation } from './ProjectPropertyInformation';
import * as styled from './styled';
import { toProjectProperty } from './utils';

export const ProjectProperties: React.FC = () => {
  const { values, setFieldValue, errors } = useFormikContext<IProjectForm>();
  const [showAdd, setShowAdd] = useState(false);
  const properties = values.properties;

  const handleAddProperty = (property: ISearchPropertyModel) => {
    const exists = !!properties.find((p) => p.propertyId === property.id);
    if (!exists) setFieldValue('properties', [...properties, toProjectProperty(values, property)]);
  };

  const classificationLimitLabels = ['Surplus Active', 'Surplus Encumbered'];
  // Disabled prop
  const {
    values: { workflowCode, statusCode },
  }: any = useFormikContext();
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
    <styled.ProjectProperties>
      <ProjectPropertyInformation disabled={disabled} />
      <Row>
        <h2>Properties in Project</h2>
        <Col flex="1">
          {errors.properties && <DisplayError field="properties" errorPrompt={true} />}
        </Col>
        <Col flex="1" align="flex-end">
          {!showAdd && !disabled && (
            <Button onClick={() => setShowAdd(!showAdd)}>Add Properties to Project</Button>
          )}
        </Col>
      </Row>
      <PropertyListViewUpdate
        field="properties"
        editableClassification
        editableZoning
        classificationLimitLabels={classificationLimitLabels}
        properties={properties}
      ></PropertyListViewUpdate>
      {showAdd && !disabled && (
        <ProjectAddProperties onAddProperty={handleAddProperty} onHide={() => setShowAdd(false)} />
      )}
    </styled.ProjectProperties>
  );
};
