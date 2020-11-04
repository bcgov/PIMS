import * as React from 'react';
import FilterBar from 'components/SearchBar/FilterBar';
import { Col } from 'react-bootstrap';
import { AutoCompleteText } from 'components/common/form';
import { IAgencyFilter } from 'interfaces';
import useCodeLookups from 'hooks/useLookupCodes';

interface IProps {
  value: IAgencyFilter;
  onChange: (value: IAgencyFilter) => void;
  handleAdd: (value: any) => void;
}

export const AgencyFilterBar: React.FC<IProps> = ({ value, onChange, handleAdd }) => {
  const lookupCodes = useCodeLookups();
  const agencyOptions = lookupCodes.getOptionsByType('Agency');

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
    >
      <Col className="d-item">
        {/* TODO: Swap out with new auto complete after grouping complete*/}
        <AutoCompleteText
          autoSetting="off"
          field="id"
          options={agencyOptions!}
          placeholder="Enter an agency"
          label="Search by Name: "
        />
      </Col>
    </FilterBar>
  );
};
