import * as React from 'react';
import FilterBar from 'components/SearchBar/FilterBar';
import { IAgencyFilter } from 'interfaces';
import useCodeLookups from 'hooks/useLookupCodes';
import { ParentGroupedFilter } from 'components/SearchBar/ParentGroupedFilter';
import { Label } from 'components/common/Label';
import { mapLookupCodeWithParentString } from 'utils';

interface IProps {
  value: IAgencyFilter;
  onChange: (value: IAgencyFilter) => void;
  handleAdd: (value: any) => void;
}

export const AgencyFilterBar: React.FC<IProps> = ({ value, onChange, handleAdd }) => {
  const lookupCodes = useCodeLookups();
  const agencyOptions = lookupCodes.getByType('Agency');
  const agencyWithParent = (agencyOptions ?? []).map(c =>
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
      <Label>Search agency by name: </Label>
      <ParentGroupedFilter
        name="id"
        options={agencyWithParent}
        className="agency-search"
        placeholder="Enter an Agency"
        filterBy={['parent', 'code', 'name']}
        inputSize="large"
      />
    </FilterBar>
  );
};
