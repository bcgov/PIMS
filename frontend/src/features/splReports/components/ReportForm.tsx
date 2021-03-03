import * as React from 'react';
import Table from 'components/Table/Table';
import { IReport, ISnapshot, ISnapshotFilter } from '../interfaces';
import { columns } from '../columns';
import useCodeLookups from 'hooks/useLookupCodes';
import * as API from 'constants/API';
import { mapSelectOptionWithParent } from 'utils';
import { useSplReportContext } from '../containers/SplReportContainer';
import { SortDirection } from 'components/Table/TableSort';

interface IReportFormProps {
  currentReport?: IReport;
  snapshots?: ISnapshot[];
}

/**
 * Wrapper component for a table displaying read only snapshot data.
 */
const ReportForm: React.FunctionComponent<IReportFormProps> = ({ currentReport, snapshots }) => {
  const data: ISnapshot[] = snapshots ?? [];
  const { getOptionsByType } = useCodeLookups();
  const agencyItems = getOptionsByType(API.AGENCY_CODE_SET_NAME);
  const agencyFilterOptions = React.useMemo(
    () => (agencyItems || []).map(c => mapSelectOptionWithParent(c, agencyItems || [])),
    [agencyItems],
  );
  const { snapshotFilter, setSnapshotFilter } = useSplReportContext();

  return (
    <Table<ISnapshot, ISnapshotFilter>
      name="spl report table"
      noRowsMessage="No Reports Available"
      filterable
      filter={snapshotFilter}
      onFilterChange={filter => setSnapshotFilter({ ...snapshotFilter, ...filter })}
      onSortChange={(field: string, direction: SortDirection) => {
        setSnapshotFilter({ ...snapshotFilter, sortBy: { [field]: direction } });
      }}
      sort={snapshotFilter.sortBy}
      columns={columns(agencyFilterOptions)}
      data={data}
      loading={snapshots === undefined}
      hideToolbar
    />
  );
};

export default ReportForm;
