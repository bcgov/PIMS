import React, { useMemo } from 'react';
import { FormControlProps, Container } from 'react-bootstrap';
import { useFormikContext, getIn } from 'formik';
import { IProperty, clickableTooltip } from '..';
import { DisplayError } from 'components/common/form';
import { Table } from 'components/Table';
import classNames from 'classnames';
import { getColumnsWithRemove } from './columns';
import { useHistory } from 'react-router-dom';

type RequiredAttributes = {
  /** The field name */
  field: string;
};

type OptionalAttributes = {
  /** The form component label */
  label?: string;
  /** Short hint that describes the expected value of an <input> element */
  placeholder?: string;
  /** Adds a custom class to the input element of the <Input> component */
  className?: string;
  /** Specifies that the HTML element should be disabled */
  disabled?: boolean;
  /** Use React-Bootstrap's custom form elements to replace the browser defaults */
  custom?: boolean;
  /** className to apply to div wrapping the table component */
  outerClassName?: string;
  /** allows table rows to be selected using this function */
  setSelectedRows?: Function;
};

// only "field" is required for <Input>, the rest are optional
export type InputProps = FormControlProps & OptionalAttributes & RequiredAttributes;

/**
 * Formik-connected Property List view allowing a list of properties to be updated.
 */
export const PropertyListViewUpdate: React.FC<InputProps> = ({
  field,
  outerClassName,
  disabled,
  setSelectedRows,
}) => {
  const history = useHistory();
  const { values, setFieldValue } = useFormikContext<any>();
  const existingProperties: IProperty[] = getIn(values, field);

  const columns = useMemo(
    () =>
      getColumnsWithRemove(
        (properties: IProperty) => setFieldValue('properties', properties),
        !disabled,
      ),
    [disabled, setFieldValue],
  );

  return (
    <Container fluid>
      <div className={classNames('ScrollContainer', outerClassName)}>
        <Table<IProperty>
          name="UpdatePropertiesTable"
          columns={columns}
          data={existingProperties}
          pageSize={-1}
          clickableTooltip={clickableTooltip}
          lockPageSize
          setSelectedRows={setSelectedRows}
          footer
          onRowClick={(row: IProperty) => {
            history.push(
              `/submitProperty/${row.propertyTypeId === 0 ? row.id : row.parcelId}?disabled=true`,
            );
          }}
        />
      </div>
      <DisplayError field={field} />
    </Container>
  );
};
