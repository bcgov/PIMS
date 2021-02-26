import './ProjectListView.scss';

import React, { useState, useMemo, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container } from 'react-bootstrap';
import * as API from 'constants/API';
import { RootState } from 'reducers/rootReducer';
import { IProjectFilter, IProject } from '.';
import { columns as cols } from './columns';
import { IProject as IProjectDetail } from 'features/projects/common';
import { Table } from 'components/Table';
import service from '../apiService';
import { FaFolder, FaFolderOpen, FaFileExcel, FaFileAlt } from 'react-icons/fa';
import { Properties } from './properties';
import FilterBar from 'components/SearchBar/FilterBar';
import { Col } from 'react-bootstrap';
import { Input, Button, Select } from 'components/common/form';
import GenericModal from 'components/common/GenericModal';
import { useHistory } from 'react-router-dom';
import {
  ReviewWorkflowStatus,
  IStatus,
  fetchProjectStatuses,
  deleteProjectWarning,
  deletePotentialSubdivisionParcels,
} from '../common';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import Claims from 'constants/claims';
import { ENVIRONMENT } from 'constants/environment';
import queryString from 'query-string';
import download from 'utils/download';
import { mapLookupCodeWithParentString, mapStatuses } from 'utils';
import styled from 'styled-components';
import TooltipWrapper from 'components/common/TooltipWrapper';
import { ParentSelect } from 'components/common/form/ParentSelect';
import variables from '_variables.module.scss';
import useCodeLookups from 'hooks/useLookupCodes';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import { PropertyTypes } from 'constants/propertyTypes';
import { toFlatProject } from '../common/projectConverter';

interface IProjectFilterState {
  name?: string;
  statusId?: string;
  agencyId?: string;
  assessWorkflow?: boolean;
  agencies?: number;
  fiscalYaer?: number;
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
  color: ${variables.primaryColor} !important;
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
  const lookupCodes = useCodeLookups();
  const agencies = useMemo(() => lookupCodes.getByType(API.AGENCY_CODE_SET_NAME), [lookupCodes]);
  const projectStatuses = useSelector<RootState, IStatus[]>(state => state.statuses as any);
  const keycloak = useKeycloakWrapper();
  const [deleteProjectNumber, setDeleteProjectNumber] = React.useState<string | undefined>();
  const [deletedProject, setDeletedProject] = React.useState<IProjectDetail | undefined>();
  const agencyIds = useMemo(() => agencies.map(x => parseInt(x.id, 10)), [agencies]);
  const agencyOptions = (agencies ?? []).map(c => mapLookupCodeWithParentString(c, agencies));
  const statuses = (projectStatuses ?? []).map(c => mapStatuses(c));
  const columns = useMemo(() => cols, []);

  // We'll start our table without any data
  const [data, setData] = useState<IProject[] | undefined>(undefined);
  const hasSubdivisions = deletedProject?.properties?.some(
    p => p.propertyTypeId === PropertyTypes.SUBDIVISION,
  );

  // Filtering and pagination state
  const [filter, setFilter] = useState<IProjectFilterState>({});
  const [clearSelected, setClearSelected] = useState(false);
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

  // the following claims are passed through to the columns in order to determine whether to display delete option
  const isAdmin = keycloak.hasClaim(Claims.ADMIN_PROJECTS);
  const projectEditClaim = keycloak.hasClaim(Claims.PROJECT_EDIT);
  const user = `${keycloak.lastName}, ${keycloak.firstName}`;

  // Update internal state whenever the filter bar state changes
  const handleFilterChange = useCallback(
    (value: IProjectFilterState) => {
      (value as any).agencies
        ? setFilter({ ...value, agencies: (value as any)?.agencies })
        : setFilter({ ...value });
      if ((value as any).statusId) {
        setFilter({ ...value, statusId: (value as any).statusId?.map((x: any) => x) });
      } else {
        setFilter({ ...value });
        setClearSelected(!clearSelected);
      }
      setPageIndex(0); // Go to first page of results when filter changes
    },
    [setFilter, setPageIndex, clearSelected],
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

      // Only update the data if this is the latest fetch
      if (fetchId === fetchIdRef.current && agencyIds?.length > 0) {
        setData(undefined);
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
      }
    },
    [setData, setPageCount, mode],
  );
  const dispatch = useDispatch();
  const route = history.location.pathname;

  // Listen for changes in pagination and use the state to fetch our new data
  useDeepCompareEffect(() => {
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
        fileName: `${reportType === 'spl' ? 'pims-spl-report' : 'pims-projects'}.${
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
    const project = data?.find(p => p.projectNumber === deleteProjectNumber);
    if (project) {
      project.status = projectStatuses.find((x: any) => x.name === project.status)!;
      const deletedProject = await service.deleteProject(project);
      setData(data?.filter(p => p.projectNumber !== project.projectNumber));
      setDeleteProjectNumber(undefined);
      setDeletedProject(toFlatProject(deletedProject));
    }
  };

  const initiateDelete = (projectNumber: string) => {
    setDeleteProjectNumber(projectNumber);
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
        data?.map(d => {
          return !!projectPropertiesMap[d.projectNumber]
            ? { ...d, properties: projectPropertiesMap[d.projectNumber] }
            : d;
        }),
      );
    }
  };

  const fiscalYears = React.useMemo(() => {
    const startYear = new Date().getFullYear() - 10;
    return Array.from(Array(12).keys())
      .map(i => {
        var year = startYear + i;
        return { label: `${year - 1} / ${year}`, value: year };
      })
      .reverse();
  }, []);

  return (
    <Container fluid className="ProjectListView">
      <div className="filter-container">
        {filterable && (
          <FilterBar<IProjectFilterState>
            initialValues={initialValues}
            onChange={handleFilterChange}
          >
            <Col xs={2} className="bar-item">
              <Input field="name" placeholder="Search by project name or number" />
            </Col>
            <Col xs={2} className="bar-item">
              <ParentSelect
                field={'statusId'}
                options={statuses}
                clearSelected={clearSelected}
                setClearSelected={setClearSelected}
                enableMultiple
                filterBy={['label', 'parent']}
                placeholder="Enter a Status"
              />
            </Col>
            <Col xs={2} className="bar-item">
              <ParentSelect
                field="agencies"
                options={agencyOptions}
                filterBy={['code', 'label', 'parent']}
                placeholder="Enter an Agency"
              />
            </Col>
            <Col xs={1} className="bar-item">
              <Select field="fiscalYear" options={fiscalYears} placeholder="Fiscal Year" />
            </Col>
          </FilterBar>
        )}
      </div>
      <div className="ScrollContainer">
        {!!deleteProjectNumber && (
          <GenericModal
            display={!!deleteProjectNumber}
            cancelButtonText="Cancel"
            okButtonText="Yes, Delete"
            handleOk={handleDelete}
            handleCancel={() => setDeleteProjectNumber(undefined)}
            title="Confirm Delete"
            message={deleteProjectWarning}
          />
        )}
        {hasSubdivisions && (
          <GenericModal
            display={hasSubdivisions}
            okButtonText="Ok"
            handleOk={handleDelete}
            handleCancel={() => setDeletedProject(undefined)}
            title="Clean up Subdivisions"
            message={deletePotentialSubdivisionParcels}
          />
        )}
        <Container fluid className="TableToolbar">
          <h3 className="mr-4">{title}</h3>
          {keycloak.hasClaim(Claims.REPORTS_VIEW) && (
            <>
              <TooltipWrapper toolTipId="export-to-excel" toolTip="Export to Excel">
                <FileIcon>
                  <FaFileExcel
                    size={36}
                    data-testid="excel-icon"
                    onClick={() => fetch('excel', 'generic')}
                  />
                </FileIcon>
              </TooltipWrapper>
              <TooltipWrapper toolTipId="export-to-excel" toolTip="Export to CSV">
                <FileIcon>
                  <FaFileAlt
                    size={36}
                    data-testid="csv-icon"
                    onClick={() => fetch('csv', 'generic')}
                  />
                </FileIcon>
              </TooltipWrapper>
            </>
          )}
        </Container>
        <Table<IProject>
          name="projectsTable"
          clickableTooltip="View Disposal Project details"
          columns={
            mode === PageMode.APPROVAL
              ? columns()
              : columns(initiateDelete, isAdmin, projectEditClaim, user)
          }
          data={data || []}
          loading={data === undefined}
          onRequestData={handleRequestData}
          pageCount={pageCount}
          pageSize={pageSize}
          pageIndex={pageIndex}
          onRowClick={onRowClick}
          detailsPanel={{
            render: project => <Properties data={project.properties} />,
            icons: {
              open: <FaFolderOpen color="black" size={20} />,
              closed: <FaFolder color="black" size={20} />,
            },
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
