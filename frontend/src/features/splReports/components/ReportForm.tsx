import Table from 'components/Table/Table';
import { SortDirection } from 'components/Table/TableSort';
import * as API from 'constants/API';
import useCodeLookups from 'hooks/useLookupCodes';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { mapSelectOptionWithParent } from 'utils';

import { columns } from '../columns';
import { useSplReportContext } from '../containers/SplReportContainer';
import { IReport, ISnapshot, ISnapshotFilter } from '../interfaces';

interface IReportFormProps {
  currentReport?: IReport;
  snapshots?: ISnapshot[];
}

/**
 * Wrapper component for a table displaying read only snapshot data.
 */
const ReportForm: React.FunctionComponent<IReportFormProps> = ({ snapshots }) => {
  const data: ISnapshot[] = snapshots ?? [];
  const { getOptionsByType } = useCodeLookups();
  const agencyItems = getOptionsByType(API.AGENCY_CODE_SET_NAME);
  const agencyFilterOptions = React.useMemo(
    () => (agencyItems || []).map((c) => mapSelectOptionWithParent(c, agencyItems || [])),
    [agencyItems],
  );
  const { snapshotFilter, setSnapshotFilter } = useSplReportContext();
  const navigate = useNavigate();
  const onRowClick = (row: ISnapshot) => {
    navigate(`/projects/disposal/${row.projectId}`);
  };

  return (
    <Table<ISnapshot, ISnapshotFilter>
      name="spl report table"
      noRowsMessage="No Reports Available"
      filterable
      filter={snapshotFilter}
      onFilterChange={(filter) => setSnapshotFilter({ ...snapshotFilter, ...filter })}
      onSortChange={(field: string, direction: SortDirection) => {
        setSnapshotFilter({ ...snapshotFilter, sortBy: { [field]: direction } });
      }}
      sort={snapshotFilter.sortBy}
      columns={columns(agencyFilterOptions)}
      data={data}
      onRowClick={onRowClick}
      loading={snapshots === undefined}
      hideToolbar
    />
  );
};

export default ReportForm;
