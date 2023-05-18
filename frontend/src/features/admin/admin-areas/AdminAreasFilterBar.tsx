import { TypeaheadField } from 'components/common/form/Typeahead';
import { Label } from 'components/common/Label';
import FilterBar from 'components/SearchBar/FilterBar';
import * as API from 'constants/API';
import useCodeLookups from 'hooks/useLookupCodes';
import * as React from 'react';
import { Col } from 'react-bootstrap';

import { IAdminAreaFilter } from './interfaces';

interface IAdminAreaFilterProps {
  /** The value being applied to the filter */
  value: IAdminAreaFilter;
  /** Action to be performed when filter is changed */
  onChange: (value: IAdminAreaFilter) => void;
  /** Action to be performed when the plus button is clicked on the adminstrative area filter bar */
  handleAdd: (value: any) => void;
}

/** Component used to help filter a list of administrative areas */
export const AdminAreaFilterBar: React.FC<IAdminAreaFilterProps> = ({
  value,
  onChange,
  handleAdd,
}) => {
  const lookupCodes = useCodeLookups();
  const adminAreas = lookupCodes.getByType(API.AMINISTRATIVE_AREA_CODE_SET_NAME);
  return (
    <>
      <FilterBar<IAdminAreaFilter>
        initialValues={value}
        headerTooltip
        headerTooltipSize={25}
        headerTooltipStyle={{ marginTop: '0.25rem', marginRight: '0.5rem' }}
        headerTooltipPlacement="bottom"
        onChange={onChange}
        searchClassName="bg-primary"
        plusButton={true}
        filterBarHeading="Administrative Areas"
        handleAdd={handleAdd}
        toolTipAddId="admin-area-add"
        toolTipAddText="Add a new Administrative Area"
        customReset={() => {
          onChange?.({ id: undefined });
        }}
        customResetField="id"
      >
        <Col md="auto">
          <Label>Search administrative area by name: </Label>
        </Col>
        <Col md="auto">
          <TypeaheadField
            hideValidation
            name="id"
            options={adminAreas}
            placeholder="Enter name"
            filterBy={['name']}
            labelKey={(option) => `${option.name}`}
          />
        </Col>
      </FilterBar>
    </>
  );
};
