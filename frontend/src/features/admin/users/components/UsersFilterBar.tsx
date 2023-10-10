import './UsersFilterBar.scss';

import { ILookupCode } from 'actions/ILookupCode';
import { Input, Select, SelectOption } from 'components/common/form';
import { ParentSelect } from 'components/common/form/ParentSelect';
import FilterBar from 'components/SearchBar/FilterBar';
import { IUsersFilter } from 'interfaces';
import * as React from 'react';
import { Col } from 'react-bootstrap';
import { mapLookupCodeWithParentString } from 'utils';

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
  const agencyOptions = (agencyLookups ?? []).map((c) =>
    mapLookupCodeWithParentString(c, agencyLookups),
  );
  const roleOptions = rolesLookups.map(
    (rl) => ({ label: rl.name, value: rl.name }) as SelectOption,
  );

  return (
    <FilterBar<IUsersFilter>
      initialValues={value}
      onChange={onChange}
      customReset={() => {
        onChange?.({ agency: '' });
      }}
      customResetField="agency"
    >
      <Col className="bar-item" md="auto">
        <Input field="username" placeholder="IDIR/BCeID" className="input" />
      </Col>
      <Col className="bar-item" md="auto">
        <Input field="firstName" placeholder="First name" className="input" />
      </Col>
      <Col className="bar-item" md="auto">
        <Input field="lastName" placeholder="Last name" className="input" />
      </Col>
      <Col className="bar-item" md="auto">
        <Input field="email" placeholder="Email" className="input" />
      </Col>
      <Col className="bar-item" md="auto">
        <Input field="position" placeholder="Position" className="input" />
      </Col>
      <Col className="bar-item" md="auto">
        <ParentSelect
          field="agency"
          options={agencyOptions}
          filterBy={['code', 'label', 'parent']}
          placeholder="Enter an Agency"
        />
      </Col>
      <Col className="bar-item" md="auto">
        <Select field="role" placeholder="Role" options={roleOptions} className="input" />
      </Col>
    </FilterBar>
  );
};
