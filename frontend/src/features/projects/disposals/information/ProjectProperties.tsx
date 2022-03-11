import { Button } from 'components/common/form';
import { Col, Row } from 'components/flex';
import { Table } from 'components/Table';
import { useFormikContext } from 'formik';
import React from 'react';
import { IProjectForm, IProjectPropertyForm } from '../interfaces';
import { PropertyColumns } from './constants';
import { ProjectAddProperties } from '.';
import { ProjectPropertyInformation } from './ProjectPropertyInformation';
import { ISearchPropertyModel } from 'hooks/api/properties/search';
import { PropertyType } from 'hooks/api';
import queryString from 'query-string';
import * as styled from './styled';
import { toProjectProperty } from './utils';

export interface IProjectPropertiesProps {}

export const ProjectProperties: React.FC<IProjectPropertiesProps> = () => {
  const { values, setFieldValue } = useFormikContext<IProjectForm>();

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
      <ProjectPropertyInformation />
      <Row>
        <h2>Properties in Project</h2>
        <Col flex="1" align="flex-end">
          {!showAdd && (
            <Button onClick={() => setShowAdd(!showAdd)}>Add Properties to Project</Button>
          )}
        </Col>
      </Row>
      <Table<IProjectPropertyForm>
        name="projectProperties"
        columns={PropertyColumns()}
        data={properties}
        footer={false}
        onRowClick={handleRowClick}
      />
      {showAdd && (
        <ProjectAddProperties onAddProperty={handleAddProperty} onHide={() => setShowAdd(false)} />
      )}
    </styled.ProjectProperties>
  );
};
