import React from 'react';
import { useFormikContext } from 'formik';
import { FastCurrencyInput } from 'components/common/form/FastCurrencyInput';
import { IProperty } from 'actions/parcelsActions';
import { CellProps } from 'react-table';
import { formatMoney } from 'utils';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import TooltipWrapper from 'components/common/TooltipWrapper';
import { Form } from 'react-bootstrap';

interface IEditableCellProps {
  namespace: string;
  suppressValidation: boolean;
  cell: CellProps<IProperty, number | ''>;
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
    <>
      <FastCurrencyInput
        formikProps={context}
        suppressValidation={suppressValidation}
        field={`${namespace}.${cell.row.id}.${cell.column.id}`}
      ></FastCurrencyInput>
    </>
  ) : (
    <TooltipWrapper
      toolTipId={`${namespace}.${cell.row.id}.${cell.column.id}`}
      toolTip="You may only edit a property if it belongs to your agency and it is not part of an SPP Project."
    >
      <i>{cell.value === undefined || cell.value === '' ? '' : formatMoney(cell.value)}</i>
    </TooltipWrapper>
  );
};

export const MoneyCell = ({ cell: { value } }: CellProps<IProperty, number | ''>) => (
  <Form.Group>{value === undefined || value === '' ? '' : formatMoney(value)}</Form.Group>
);

export const AsterixMoneyCell = ({ cell: { value } }: CellProps<IProperty, number | ''>) => (
  <Form.Group>{value === undefined || value === '' ? '' : `${formatMoney(value)} *`}</Form.Group>
);
