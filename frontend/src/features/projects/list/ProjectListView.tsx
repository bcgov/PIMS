import './ProjectListView.scss';

import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container } from 'react-bootstrap';
import _ from 'lodash';
import * as API from 'constants/API';
import { RootState } from 'reducers/rootReducer';
import { ILookupCode } from 'actions/lookupActions';
import { ILookupCodeState } from 'reducers/lookupCodeReducer';
import { IProjectFilter, IProject } from '.';
import { columns as cols } from './columns';
import { Table } from 'components/Table';
import service from '../apiService';
import { FaFolder, FaFolderOpen, FaFileExcel, FaFileAlt } from 'react-icons/fa';
import { Properties } from './properties';
import FilterBar from 'components/SearchBar/FilterBar';
import { Col } from 'react-bootstrap';
import { Input, Button, Select } from 'components/common/form';
import GenericModal from 'components/common/GenericModal';
import { useHistory } from 'react-router-dom';
import { ReviewWorkflowStatus, IStatus, fetchProjectStatuses } from '../common';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import Claims from 'constants/claims';
import { ENVIRONMENT } from 'constants/environment';
import queryString from 'query-string';
import download from 'utils/download';
import { mapLookupCode, mapStatuses } from 'utils';
import styled from 'styled-components';
import { ParentGroupedFilter } from 'components/SearchBar/ParentGroupedFilter';

interface IProjectFilterState {
  name?: string;
  statusId?: string;
  agencyId?: string;
  assessWorkflow?: boolean;
  agencies?: number;
}

const initialValues = {
  name: '',
  statusId: '',
  agencyId: '',
};

const getProjectReportUrl = (filter: IProjectFilter) =>
  `${ENVIRONMENT.apiUrl}/reports/projects?${filter ? queryString.stringify(filter) : ''}`;

export const getProjectFinancialReportUrl = (filter?: IProjectFilter) =>
  `${ENVIRONMENT.apiUrl}/reports/projects/surplus/properties/list?${
    filter ? queryString.stringify(filter) : ''
  }`;

const FileIcon = styled(Button)`
  background-color: white !important;
  color: #003366 !important;
`;

const initialQuery: IProjectFilter = {
  page: 1,
  quantity: 10,
};

export const getServerQuery = (state: {
  pageIndex: number;
  pageSize: number;
  filter: IProjectFilterState;
  agencyIds?: number[];
}) => {
  const { pageIndex, pageSize, filter: search } = state;

  const query: any = {
    ...initialQuery,
    // TODO: this field is not yet implemented in FilterBar
    page: pageIndex + 1,
    quantity: pageSize,
    ...search,
  };
  return query;
};

export enum PageMode {
  DEFAULT,
  APPROVAL,
}

interface IProps {
  filterable?: boolean;
  title: string;
  mode?: PageMode;
}

const ProjectListView: React.FC<IProps> = ({ filterable, title, mode }) => {
  // lookup codes, etc
  const lookupCodes = useSelector<RootState, ILookupCode[]>(
    state => (state.lookupCode as ILookupCodeState).lookupCodes,
  );
  const agencies = useMemo(
    () =>
      _.filter(lookupCodes, (lookupCode: ILookupCode) => {
        return lookupCode.type === API.AGENCY_CODE_SET_NAME;
      }),
    [lookupCodes],
  );
  const projectStatuses = useSelector<RootState, IStatus[]>(state => state.statuses as any);
  const keycloak = useKeycloakWrapper();
  const [deleteId, setDeleteId] = React.useState<string | undefined>();
  const agencyIds = useMemo(() => agencies.map(x => parseInt(x.id, 10)), [agencies]);
  const agencyOptions = (agencies ?? []).map(c => mapLookupCode(c, null));
  const statuses = (projectStatuses ?? []).map(c => mapStatuses(c));
  const columns = useMemo(() => cols, []);

  // We'll start our table without any data
  const [data, setData] = useState<IProject[]>([]);

  // Filtering and pagination state
  const [filter, setFilter] = useState<IProjectFilterState>({});
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const history = useHistory();

  // const [loading, setLoading] = useState(false);
  const fetchIdRef = useRef(0);

  // This will get called when the table needs new data
  const handleRequestData = useCallback(
    async ({ pageIndex, pageSize }: { pageIndex: number; pageSize: number }) => {
      setPageSize(pageSize);
      setPageIndex(pageIndex);
    },
    [setPageSize, setPageIndex],
  );

  // Update internal state whenever the filter bar state changes
  const handleFilterChange = useCallback(
    (value: IProjectFilterState) => {
      (value as any).agencies?.value
        ? setFilter({ ...value, agencies: (value as any)?.agencies.value })
        : setFilter({ ...value });
      setPageIndex(0); // Go to first page of results when filter changes
    },
    [setFilter, setPageIndex],
  );

  const onPageSizeChanged = useCallback(size => {
    setPageSize(size);
  }, []);

  const fetchData = useCallback(
    async ({
      pageIndex,
      pageSize,
      filter,
      agencyIds,
    }: {
      pageIndex: number;
      pageSize: number;
      filter: IProjectFilterState;
      agencyIds: number[];
    }) => {
      // Give this fetch an ID
      const fetchId = ++fetchIdRef.current;

      // TODO: Set the loading state
      // setLoading(true);

      // Only update the data if this is the latest fetch
      if (fetchId === fetchIdRef.current && agencyIds?.length > 0) {
        const query = getServerQuery({
          pageIndex,
          pageSize,
          filter: mode === PageMode.APPROVAL ? { ...filter, assessWorkflow: true } : filter,
        });
        const data = await service.getProjectList(query);

        // The server could send back total page count.
        // For now we'll just calculate it.
        setData(
          data.items.map((project: IProject) => {
            return project;
          }),
        );
        setPageCount(Math.ceil(data.total / pageSize));

        // setLoading(false);
      }
    },
    [setData, setPageCount, mode],
  );
  const dispatch = useDispatch();
  const route = history.location.pathname;

  // Listen for changes in pagination and use the state to fetch our new data
  useEffect(() => {
    route === '/projects/list' && dispatch(fetchProjectStatuses());
    fetchData({ pageIndex, pageSize, filter, agencyIds });
  }, [fetchData, pageIndex, pageSize, filter, agencyIds, dispatch, route]);

  const fetch = (accept: 'csv' | 'excel', reportType: 'generic' | 'spl') => {
    const query = getServerQuery({ pageIndex, pageSize, filter, agencyIds });
    return dispatch(
      download({
        url:
          reportType === 'generic'
            ? getProjectReportUrl({ ...query, all: true })
            : getProjectFinancialReportUrl({ ...query, all: true }),
        fileName: `${reportType === 'spl' ? 'spl_report' : 'generic_project_report'}.${
          accept === 'csv' ? 'csv' : 'xlsx'
        }`,
        actionType: 'projects-report',
        headers: {
          Accept: accept === 'csv' ? 'text/csv' : 'application/vnd.ms-excel',
        },
      }),
    );
  };

  const handleDelete = async () => {
    const project = data.find(p => p.projectNumber === deleteId);
    if (project) {
      await service.deleteProject(project);
      setData(data.filter(p => p.projectNumber !== project.projectNumber));
    }
  };

  const initiateDelete = (projectNumber: string) => {
    setDeleteId(projectNumber);
  };

  const onRowClick = (row: IProject) => {
    const ReviewWorkflowStatuses = Object.keys(ReviewWorkflowStatus).map(
      (k: string) => (ReviewWorkflowStatus as any)[k],
    );
    if (ReviewWorkflowStatuses.includes(row.statusCode)) {
      if (keycloak.hasClaim(Claims.ADMIN_PROJECTS)) {
        history.push(`${row.statusRoute}?projectNumber=${row.projectNumber}`);
      } else {
        history.push(`/projects/summary?projectNumber=${row.projectNumber}`);
      }
    } else {
      history.push(`/dispose${row.statusRoute}?projectNumber=${row.projectNumber}`);
    }
  };

  const lazyLoadProperties = async (expandedRows: IProject[]) => {
    if (expandedRows.length > 0) {
      expandedRows = expandedRows.filter(x => x.properties.length === 0);
      const properties = await Promise.all(
        expandedRows.map(async project => await service.loadProperties(project.projectNumber)),
      );
      const projectPropertiesMap = properties.reduce((map: any, current: any) => {
        const ids = Object.keys(current);
        const projectId = ids[0];
        return { ...map, [projectId]: current[projectId] };
      }, {});
      setData(
        data.map(d => {
          return !!projectPropertiesMap[d.projectNumber]
            ? { ...d, properties: projectPropertiesMap[d.projectNumber] }
            : d;
        }),
      );
    }
  };

  return (
    <Container fluid className="ProjectListView">
      <div className="filter-container">
        {filterable && (
          <FilterBar<IProjectFilterState>
            initialValues={initialValues}
            onChange={handleFilterChange}
          >
            <Col xs={2} className="bar-item">
              <Select field="statusId" options={statuses} placeholder="Select a project status" />
            </Col>
            <Col xs={2} className="bar-item">
              <ParentGroupedFilter
                name="agencies"
                options={agencyOptions}
                className="map-filter-typeahead"
                filterBy={['code', 'label', 'parent']}
                placeholder="Enter an Agency"
                inputSize="large"
              />
            </Col>
            <Col xs={2} className="bar-item">
              <Input field="name" placeholder="Search by project name" />
            </Col>
          </FilterBar>
        )}
      </div>
      <div className="ScrollContainer">
        {!!deleteId && (
          <GenericModal
            display={!!deleteId}
            cancelButtonText="Cancel"
            okButtonText="Yes, Delete"
            handleOk={handleDelete}
            handleCancel={() => setDeleteId(undefined)}
            title="Confirm Delete"
            message="Are you sure that you want to delete this project?"
          />
        )}
        <Container fluid className="TableToolbar">
          <h3 className="mr-4">{title}</h3>
          {keycloak.hasClaim(Claims.REPORTS_SPL) && (
            <Button className="mr-auto" onClick={() => history.push('/reports/spl')}>
              SPL Report
            </Button>
          )}
          {keycloak.hasClaim(Claims.REPORTS_VIEW) && (
            <>
              <FileIcon className="mr-1 p-0" onClick={() => fetch('excel', 'generic')}>
                <FaFileExcel size={36} title="Export Generic Report" />
              </FileIcon>
              <FileIcon className="mr-1 p-0" onClick={() => fetch('csv', 'generic')}>
                <FaFileAlt title="Export CSV" size={36} />
              </FileIcon>
            </>
          )}
        </Container>
        <Table<IProject>
          name="projectsTable"
          columns={mode === PageMode.APPROVAL ? columns() : columns(initiateDelete)}
          data={data}
          onRequestData={handleRequestData}
          pageCount={pageCount}
          pageSize={pageSize}
          pageIndex={pageIndex}
          onRowClick={onRowClick}
          detailsPanel={{
            render: project => <Properties data={project.properties} />,
            icons: { open: <FaFolderOpen color="black" />, closed: <FaFolder color="black" /> },
            checkExpanded: (row, state) => !!state.find(x => x.projectNumber === row.projectNumber),
            onExpand: lazyLoadProperties,
            getRowId: row => row.projectNumber,
          }}
          onPageSizeChange={onPageSizeChanged}
        />
      </div>
    </Container>
  );
};

export const ProjectApprovalRequestListView = () => {
  return (
    <ProjectListView
      filterable={false}
      mode={PageMode.APPROVAL}
      title="Surplus Property Program Projects - Approval Requests"
    />
  );
};

export default () => <ProjectListView title="My Agency's Projects" filterable={true} />;
