import React from 'react';
import { useFormikContext } from 'formik';
import { FastCurrencyInput } from 'components/common/form/FastCurrencyInput';
import { IProperty } from 'actions/parcelsActions';
import { CellProps } from 'react-table';
import { formatMoney } from 'utils';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import TooltipWrapper from 'components/common/TooltipWrapper';
import { PropertyTypes } from 'constants/propertyTypes';

/**
 * Editable cell configuration properties.
 */
interface IEditableCellProps {
  /** Namespace to the object being edited. */
  namespace: string;
  /** Whether to suppress validation on edit. */
  suppressValidation: boolean;
  /** The react-table cell that will be passed to the component. */
  cell: CellProps<IProperty, number>;
}

/**
 * Provides a currency editing input if the user is allowed to edit the property.
 * @param param0 Configuration properties for this editable money cell.
 */
export const EditableMoneyCell = ({
  namespace = 'properties',
  suppressValidation,
  cell,
}: IEditableCellProps) => {
  const context = useFormikContext();

  const property = cell.row.original;
  const canEdit = useKeycloakWrapper().canUserEditProperty(property);

  return canEdit ? (
    <FastCurrencyInput
      formikProps={context}
      suppressValidation={suppressValidation}
      field={`${namespace}.${cell.row.id}.${cell.column.id}`}
    ></FastCurrencyInput>
  ) : (
    <TooltipWrapper
      toolTipId={`${namespace}.${cell.row.id}.${cell.column.id}`}
      toolTip="You may only edit a property if it belongs to your agency and it is not part of an SPP Project."
    >
      <i>{formatMoney(cell.value)}</i>
    </TooltipWrapper>
  );
};

/**
 * Provides a currency editing input if the user is allowed to edit the property and if the property is land/subdivision.
 * @param param0 Configuration properties for this editable money cell.
 */
export const EditableLandMoneyCell = ({
  namespace = 'properties',
  suppressValidation,
  cell,
}: IEditableCellProps) => {
  const context = useFormikContext();

  const property = cell.row.original;
  const canEdit =
    useKeycloakWrapper().canUserEditProperty(property) &&
    cell.row.values.propertyTypeId !== PropertyTypes.BUILDING;

  return canEdit ? (
    <FastCurrencyInput
      formikProps={context}
      suppressValidation={suppressValidation}
      field={`${namespace}.${cell.row.id}.${cell.column.id}`}
    ></FastCurrencyInput>
  ) : (
    <TooltipWrapper
      toolTipId={`${namespace}.${cell.row.id}.${cell.column.id}`}
      toolTip="You may only edit a property if it belongs to your agency and it is not part of an SPP Project."
    >
      <i>{formatMoney(cell.value)}</i>
    </TooltipWrapper>
  );
};

/**
 * Formats the value as currency if there is a value passed, otherwise returns null.
 * @param param0 The react-table cell property.
 */
export const MoneyCell = ({ cell: { value } }: CellProps<IProperty, number>) =>
  value === undefined || value === null ? null : formatMoney(value);
