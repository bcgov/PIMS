import * as React from 'react';
import FilterBar from 'components/SearchBar/FilterBar';
import { Col } from 'react-bootstrap';
import { Input, SelectOption, Select } from 'components/common/form';
import { ILookupCode } from 'actions/lookupActions';
import { IUsersFilter } from 'interfaces';
import { mapLookupCodeWithParentString } from 'utils';
import { ParentSelect } from 'components/common/form/ParentSelect';

interface IProps {
  value: IUsersFilter;
  agencyLookups: ILookupCode[];
  rolesLookups: ILookupCode[];
  onChange: (value: IUsersFilter) => void;
}

export const UsersFilterBar: React.FC<IProps> = ({
  value,
  agencyLookups,
  rolesLookups,
  onChange,
}) => {
  const agencyOptions = (agencyLookups ?? []).map(c =>
    mapLookupCodeWithParentString(c, agencyLookups),
  );
  const roleOptions = rolesLookups.map(rl => ({ label: rl.name, value: rl.name } as SelectOption));

  return (
    <FilterBar<IUsersFilter>
      initialValues={value}
      onChange={onChange}
      customReset={() => {
        onChange?.({ agency: '' });
      }}
      customResetField="agency"
    >
      <Col className="bar-item">
        <Input field="username" placeholder="IDIR/BCeID" />
      </Col>
      <Col className="bar-item">
        <Input field="firstName" placeholder="First name" />
      </Col>
      <Col className="bar-item">
        <Input field="lastName" placeholder="Last name" />
      </Col>
      <Col className="bar-item">
        <Input field="email" placeholder="Email" />
      </Col>
      <Col className="bar-item">
        <Input field="position" placeholder="Position" />
      </Col>
      <Col className="bar-item">
        <ParentSelect
          field="agency"
          options={agencyOptions}
          filterBy={['code', 'label', 'parent']}
          placeholder="Enter an Agency"
        />
      </Col>
      <Col className="bar-item">
        <Select field="role" placeholder="Role" options={roleOptions} />
      </Col>
    </FilterBar>
  );
};
