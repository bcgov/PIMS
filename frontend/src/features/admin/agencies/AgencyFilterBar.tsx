import { ParentSelect } from 'components/common/form/ParentSelect';
import { Label } from 'components/common/Label';
import FilterBar from 'components/SearchBar/FilterBar';
import useCodeLookups from 'hooks/useLookupCodes';
import { IAgencyFilter } from 'interfaces';
import * as React from 'react';
import { Col } from 'react-bootstrap';
import { mapLookupCodeWithParentString } from 'utils';

interface IProps {
  value: IAgencyFilter;
  onChange: (value: IAgencyFilter) => void;
  handleAdd: (value: any) => void;
}

export const AgencyFilterBar: React.FC<IProps> = ({ value, onChange, handleAdd }) => {
  const lookupCodes = useCodeLookups();
  const agencyOptions = lookupCodes.getByType('Agency');
  const agencyWithParent = (agencyOptions ?? []).map((c) =>
    mapLookupCodeWithParentString(c, agencyOptions),
  );
  return (
    <FilterBar<IAgencyFilter>
      initialValues={value}
      onChange={onChange}
      searchClassName="bg-primary"
      plusButton={true}
      filterBarHeading="Agencies"
      handleAdd={handleAdd}
      toolTipAddId="agency-filter-add"
      toolTipAddText="Add a new Agency"
      customReset={() => {
        onChange?.({ id: '' });
      }}
      customResetField="id"
    >
      <Col className="bar-item" md="auto">
        <Label>Search agency by name: </Label>
      </Col>
      <Col className="bar-item parent-select" md="auto">
        <ParentSelect
          field="id"
          options={agencyWithParent}
          placeholder="Enter an Agency"
          filterBy={['parent', 'code', 'name']}
        />
      </Col>
    </FilterBar>
  );
};
