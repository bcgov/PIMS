import React from 'react';
import { useFormikContext } from 'formik';
import { FastCurrencyInput } from 'components/common/form/FastCurrencyInput';
import { IProperty } from 'actions/parcelsActions';
import { CellProps } from 'react-table';
import { formatMoney } from 'utils';

export const EditableMoneyCell: React.FC<any> = ({
  namespace = 'properties',
  suppressValidation,
  cell,
  ...props
}: any) => {
  const context = useFormikContext();
  return (
    <FastCurrencyInput
      formikProps={context}
      suppressValidation={suppressValidation}
      field={`${namespace}.${cell.row.id}.${cell.column.id}`}
    ></FastCurrencyInput>
  );
};

export const MoneyCell = ({ cell: { value } }: CellProps<IProperty, number>) => formatMoney(value);
