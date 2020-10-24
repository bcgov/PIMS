import * as React from 'react';
import Table from 'components/Table/Table';
import { IReport, ISnapshot } from '../interfaces';
import { columns } from '../columns';

interface IReportFormProps {
  currentReport?: IReport;
  snapshots?: ISnapshot[];
}

/**
 * Wrapper component for a table displaying read only snapshot data.
 */
const ReportForm: React.FunctionComponent<IReportFormProps> = ({ currentReport, snapshots }) => {
  const data: ISnapshot[] = snapshots ?? [];
  return (
    <Table
      name="spl report table"
      noRowsMessage="No Reports Available"
      columns={columns}
      data={data}
      loading={snapshots === undefined}
      hideToolbar
    ></Table>
  );
};

export default ReportForm;
