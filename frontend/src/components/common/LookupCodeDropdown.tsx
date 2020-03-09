import React, { useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import _ from 'lodash';
import { ILookupCode } from 'actions/lookupActions';
import { FormikProps } from 'formik';
import './LookupCodeDropdown.scss';

type LookupCodeDropdownProps = {
  defaultTitle: string;
  lookupCodes: ILookupCode[];
  onSelectCode: (codeId: string | null) => void;
  name?: string;
  hideAny?: boolean;
  errors?: boolean;
};

const getNameById = (codeSet: ILookupCode[], codeId: string) => {
  return _.find(codeSet, ['id', codeId])?.name || '';
};

/**
 * Generic component used to display a dropdown list of {@link ILookupCode}
 * @param props {@link LookupCodeDropdownProps}
 */
function LookupCodeDropdown(props: LookupCodeDropdownProps) {
  const [codeDropdownTitle, setCodeDropdownTitle] = useState<string>(props.defaultTitle);

  const onCodeItemChange = (eventKey: string) => {
    if (parseInt(eventKey) === -1) {
      setCodeDropdownTitle('Any');
      props.onSelectCode(null);
      return;
    }
    const agencyName = getNameById(props.lookupCodes, eventKey);
    setCodeDropdownTitle(agencyName);
    props.onSelectCode(eventKey);
  };

  return (
    <DropdownButton
      id="dropdown-basic-button"
      title={codeDropdownTitle}
      bsPrefix="map-filter-dropdown"
      onSelect={onCodeItemChange}
      className={props.errors ? 'error' : null}
    >
      {props.hideAny ? null : <Dropdown.Item eventKey={'-1'}>Any</Dropdown.Item>}
      {props.lookupCodes.map(code => {
        return (
          <Dropdown.Item eventKey={code.id.toString()} key={code.id.toString()}>
            {code.name}
          </Dropdown.Item>
        );
      })}
    </DropdownButton>
  );
}

type FormikLookupCodeDropdownProps = {
  defaultTitle: string;
  lookupCodes: ILookupCode[];
  name: string;
};
export const FormikLookupCodeDropdown = <T extends unknown>(
  props: FormikLookupCodeDropdownProps & FormikProps<T>,
) => {
  if (!props.name) {
    throw new Error('Formik field name must be provided');
  }
  const onSelectCode = (codeId: string | null): void => {
    const nameVal: string = String(props.name);
    props.setFieldValue(nameVal, codeId);
  };
  const isError = () => {
    return _.has(props.errors, props.name) && _.has(props.touched, props.name);
  };
  return (
    <LookupCodeDropdown
      errors={isError()}
      hideAny={true}
      onSelectCode={onSelectCode}
      defaultTitle={props.defaultTitle}
      lookupCodes={props.lookupCodes}
    ></LookupCodeDropdown>
  );
};

export default LookupCodeDropdown;
