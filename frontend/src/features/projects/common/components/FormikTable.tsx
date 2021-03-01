import React, { useMemo } from 'react';
import { Container } from 'react-bootstrap';
import { Table } from 'components/Table';
import { useFormikContext, getIn } from 'formik';

interface IFormikTableProps {
  /** column array to use to build the table */
  columns: any[];
  /** the array to use to populate the table rows */
  field: string;
  /** table field name */
  name: string;
  /** whether or not this table should have editable columns */
  disabled?: boolean;
  /** whether or not to provide this table with a row click function */
  onRowClick?: (row: any) => void;
  /** display a tooltip to inform the user what will happen on row click */
  clickableTooltip?: string;
}

const FormikTable: React.FC<IFormikTableProps> = ({
  columns,
  field,
  name,
  disabled,
  onRowClick,
  clickableTooltip,
}: IFormikTableProps) => {
  const { values } = useFormikContext();
  const data = getIn(values, field) ?? [];

  return (
    <Container fluid className="PropertyListView">
      <div className="ScrollContainer">
        {useMemo(
          () => (
            <Table<any>
              name={name}
              columns={columns}
              data={data}
              onRowClick={onRowClick ?? onRowClick}
              pageCount={1}
              clickableTooltip={clickableTooltip ?? clickableTooltip}
              hideToolbar
              footer
            />
          ),
          // TODO: This is almost guaranteed to be an invalid list of dependencies for this Memo.
          // eslint-disable-next-line react-hooks/exhaustive-deps
          [data.length, name],
        )}
      </div>
    </Container>
  );
};

export default FormikTable;
