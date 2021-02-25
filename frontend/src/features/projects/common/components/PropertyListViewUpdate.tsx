import React, { useMemo, useCallback } from 'react';
import { FormControlProps, Container } from 'react-bootstrap';
import { useFormikContext, getIn } from 'formik';
import { IProperty, clickableTooltip } from '../../common';
import { DisplayError } from 'components/common/form';
import { Table } from 'components/Table';
import classNames from 'classnames';
import { getPropertyColumns, getColumnsWithRemove } from './columns';
import { useStepper } from 'features/projects/dispose';
import queryString from 'query-string';
import { PropertyTypes } from 'constants/propertyTypes';

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
  /** makes the classification column editable */
  editableClassification?: boolean;
  /** makes the financial columns editable */
  editableFinancials?: boolean;
  /** makes the zoning columns editable */
  editableZoning?: boolean;
  /** limit the available classification labels that are returned */
  classificationLimitLabels?: string[];
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
  editableClassification,
  editableFinancials,
  editableZoning,
  classificationLimitLabels,
}) => {
  const { values, setFieldValue } = useFormikContext<any>();
  const existingProperties: IProperty[] = getIn(values, field);
  const { project } = useStepper();
  const columns = useMemo(
    () =>
      disabled
        ? getPropertyColumns({
            project,
            editableClassification: !disabled && editableClassification,
            editableFinancials: !disabled && editableFinancials,
            editableZoning: !disabled && editableZoning,
            limitLabels: classificationLimitLabels ?? [],
          })
        : getColumnsWithRemove({
            setProperties: (properties: IProperty) => setFieldValue('properties', properties),
            project,
            editableClassification: !disabled && editableClassification,
            editableFinancials: !disabled && editableFinancials,
            editableZoning: !disabled && editableZoning,
            limitLabels: classificationLimitLabels,
          }),
    [
      project,
      disabled,
      editableClassification,
      editableFinancials,
      editableZoning,
      classificationLimitLabels,
      setFieldValue,
    ],
  );

  const onRowClick = useCallback((row: IProperty) => {
    window.open(
      `/mapview?${queryString.stringify({
        sidebar: true,
        disabled: true,
        loadDraft: false,
        parcelId: [PropertyTypes.PARCEL, PropertyTypes.SUBDIVISION].includes(row.propertyTypeId)
          ? row.id
          : undefined,
        buildingId: row.propertyTypeId === PropertyTypes.BUILDING ? row.id : undefined,
      })}`,
      '_blank',
    );
  }, []);

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
          onRowClick={onRowClick}
        />
      </div>
      <DisplayError field={field} />
    </Container>
  );
};
