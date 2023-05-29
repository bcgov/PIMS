import { Input, Select } from 'components/common/form';
import ResetButton from 'components/common/form/ResetButton';
import SearchButton from 'components/common/form/SearchButton';
import { TypeaheadField } from 'components/common/form/Typeahead';
import { Col, Row } from 'components/flex';
import { useFormikContext } from 'formik';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import React from 'react';
import { LookupType, useLookups } from 'store/hooks';

import { IProjectForm, IProjectPropertyFilter } from '../interfaces';

interface IProjectPropertyFilterProps {
  onChange: (value: IProjectPropertyFilter) => void;
  filter: IProjectPropertyFilter;
}

export const ProjectPropertyFilter: React.FC<IProjectPropertyFilterProps> = ({
  onChange,
  filter: defaultFilter,
}) => {
  const { controller } = useLookups();
  const { values, setFieldValue } = useFormikContext<IProjectForm>();
  const keycloak = useKeycloakWrapper();

  const [clear, setClear] = React.useState(false);
  const filter = values.filter ?? defaultFilter;

  const agencies = controller
    .getOptions(LookupType.Agency)
    .filter((a) => !!keycloak.agencyIds.find((id) => `${a.value}` === `${id}`));
  const classifications = controller.getOptions(LookupType.PropertyClassification);
  const adminAreas = controller.getOptions(LookupType.AdministrativeArea);

  const handleSearch = async (e: any) => {
    e.preventDefault();
    onChange(values.filter);
  };

  const handleReset = (e: any) => {
    e.preventDefault();
    setClear(true);
    setFieldValue('filter', defaultFilter);
  };

  return (
    <Row columnGap={0}>
      <Col flex="1">
        <Input
          field="filter.pid"
          placeholder="PID or PIN"
          onChange={(e: any) => {
            const value = e.target?.value;
            setFieldValue('filter', { ...filter, pid: value });
          }}
        />
      </Col>
      <Col flex="2">
        <Input
          field="filter.address"
          placeholder="Address or City"
          onChange={(e: any) => {
            const value = e.target?.value;
            setFieldValue('filter', { ...filter, address: value });
          }}
        />
      </Col>
      <Col flex="2">
        <Select field="filter.agencies" placeholder="Agency" options={agencies} />
      </Col>
      <Col flex="2">
        <Select
          field="filter.classificationId"
          placeholder="Classification"
          options={classifications}
        />
      </Col>
      <Col flex="2">
        <TypeaheadField
          name="filter.administrativeArea"
          placeholder="Location"
          selectClosest
          hideValidation={true}
          options={adminAreas.map((x) => x.label)}
          onChange={(items) => {
            if (!!items.length)
              setFieldValue('filter', { ...filter, administrativeArea: items[0] });
            else setFieldValue('filter', { ...filter, administrativeArea: '' });
          }}
          clearSelected={clear}
          setClear={setClear}
        />
      </Col>
      <SearchButton onClick={handleSearch} />
      <ResetButton onClick={handleReset} />
    </Row>
  );
};
