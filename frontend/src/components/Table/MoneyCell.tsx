import { IProperty } from 'actions/parcelsActions';
import { FastCurrencyInput } from 'components/common/form/FastCurrencyInput';
import TooltipWrapper from 'components/common/TooltipWrapper';
import { useFormikContext } from 'formik';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import React from 'react';
import { Form } from 'react-bootstrap';
import { CellProps, Renderer } from 'react-table';
import { formatMoney } from 'utils';

interface IEditableCellProps {
  namespace: string;
  suppressValidation: boolean;
  cell: CellProps<IProperty, number | ''>;
  tooltip?: string;
}

export const EditableMoneyCell = ({
  namespace = 'properties',
  suppressValidation,
  cell,
  tooltip,
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
        tooltip={tooltip}
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

export const MoneyCell: Renderer<CellProps<IProperty, number | ''>> = ({ cell: { value } }) => (
  <Form.Group>{value == null || `${value}` === '' ? '' : formatMoney(value)}</Form.Group>
);

export const AsterixMoneyCell: Renderer<CellProps<IProperty, number | ''>> = ({
  cell: { value },
}) => (
  <Form.Group>{value === undefined || value === '' ? '' : `${formatMoney(value)} *`}</Form.Group>
);
