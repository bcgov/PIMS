import { Button } from 'components/common/form';
import { Col, Row } from 'components/flex';
import { Table } from 'components/Table';
import { useFormikContext } from 'formik';
import { PropertyType } from 'hooks/api';
import { ISearchPropertyModel } from 'hooks/api/properties/search';
import queryString from 'query-string';
import React from 'react';

import { IProjectForm, IProjectPropertyForm } from '../interfaces';
import { DisplayError } from './../../../../components/common/form/DisplayError';
import { ProjectAddProperties } from '.';
import { PropertyColumns } from './constants';
import { ProjectPropertyInformation } from './ProjectPropertyInformation';
import * as styled from './styled';
import { toProjectProperty } from './utils';

export interface IProjectPropertiesProps {
  disabled?: boolean;
}

export const ProjectProperties: React.FC<IProjectPropertiesProps> = ({ disabled = false }) => {
  const { values, setFieldValue, errors } = useFormikContext<IProjectForm>();

  const [showAdd, setShowAdd] = React.useState(false);
  const properties = values.properties;

  const handleAddProperty = (property: ISearchPropertyModel) => {
    const exists = !!properties.find(p => p.propertyId === property.id);
    if (!exists) setFieldValue('properties', [...properties, toProjectProperty(values, property)]);
  };

  const handleRowClick = React.useCallback((row: IProjectPropertyForm) => {
    window.open(
      `/mapview?${queryString.stringify({
        sidebar: true,
        disabled: true,
        loadDraft: false,
        parcelId: [PropertyType.Parcel, PropertyType.Subdivision].includes(row.propertyTypeId)
          ? row.propertyId
          : undefined,
        buildingId: row.propertyTypeId === PropertyType.Building ? row.propertyId : undefined,
      })}`,
      '_blank',
    );
  }, []);

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
      <Table<IProjectPropertyForm>
        name="projectProperties"
        columns={PropertyColumns(disabled)}
        data={properties}
        footer={false}
        onRowClick={handleRowClick}
      />
      {showAdd && !disabled && (
        <ProjectAddProperties onAddProperty={handleAddProperty} onHide={() => setShowAdd(false)} />
      )}
    </styled.ProjectProperties>
  );
};
