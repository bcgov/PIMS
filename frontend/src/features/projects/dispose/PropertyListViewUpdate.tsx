import React, { useMemo } from 'react';
import { FormControlProps, Container } from 'react-bootstrap';
import { useFormikContext, getIn } from 'formik';
import { IProperty } from '.';
import { DisplayError } from 'components/common/form';
import { Table } from 'components/Table';
import classNames from 'classnames';
import { getColumns } from './columns';

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
  outerClassName?: string;
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
}) => {
  const { values } = useFormikContext<any>();
  const existingProperties: IProperty[] = getIn(values, field);

  const columns = useMemo(() => getColumns(true), []);

  return (
    <Container fluid>
      <div className={classNames('ScrollContainer', outerClassName)}>
        <Table<IProperty>
          name="propertiesTable"
          columns={columns}
          data={existingProperties}
          pageSize={-1}
          lockPageSize
        />
      </div>
      <DisplayError field={field} />
    </Container>
  );
};
