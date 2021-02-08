import React from 'react';
import { useFormikContext } from 'formik';
import { FastCurrencyInput } from 'components/common/form/FastCurrencyInput';
import { IProperty } from 'actions/parcelsActions';
import { CellProps } from 'react-table';
import { formatMoney } from 'utils';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import TooltipWrapper from 'components/common/TooltipWrapper';

interface IEditableCellProps {
  namespace: string;
  suppressValidation: boolean;
  cell: CellProps<IProperty, number>;
}

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

export const MoneyCell = ({ cell: { value } }: CellProps<IProperty, number>) => formatMoney(value);
