import React, { useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import _ from 'lodash';
import { ILookupCode } from 'actions/lookupActions';
import './LookupCodeDropdown.scss';

type LookupCodeDropdownProps = {
  defaultTitle: string;
  lookupCodes: ILookupCode[];
  onSelectCode: (codeId: number | null) => void;
};

const getNameById = (codeSet: ILookupCode[], codeId: number) => {
  return _.find(codeSet, ['id', codeId])?.name || '';
};

/**
 * Generic component used to display a dropdown list of {@link ILookupCode}
 * @param props {@link LookupCodeDropdownProps}
 */
function LookupCodeDropdown(props: LookupCodeDropdownProps) {
  const [codeDropdownTitle, setCodeDropdownTitle] = useState<string>(props.defaultTitle);

  const onCodeItemChange = (eventKey: string) => {
    const eventKeyId = parseInt(eventKey);
    if (eventKeyId < 0) {
      setCodeDropdownTitle('Any');
      props.onSelectCode(null);
      return;
    }
    const agencyName = getNameById(props.lookupCodes, eventKeyId);
    setCodeDropdownTitle(agencyName);
    props.onSelectCode(eventKeyId);
  };

  return (
    <DropdownButton
      id="dropdown-basic-button"
      title={codeDropdownTitle}
      bsPrefix="map-filter-dropdown"
      onSelect={onCodeItemChange}
    >
      <Dropdown.Item eventKey={'-1'}>Any</Dropdown.Item>
      {props.lookupCodes.map(code => {
        return <Dropdown.Item eventKey={code.id.toString()} key={code.id.toString()}>{code.name}</Dropdown.Item>
      })}
    </DropdownButton>
  );
}

export default LookupCodeDropdown;
