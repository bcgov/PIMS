import './ProjectListView.scss';

import variables from '_variables.module.scss';
import { Button, Input, Select } from 'components/common/form';
import { ParentSelect } from 'components/common/form/ParentSelect';
import GenericModal from 'components/common/GenericModal';
import TooltipWrapper from 'components/common/TooltipWrapper';
import FilterBar from 'components/SearchBar/FilterBar';
import { Table } from 'components/Table';
import * as API from 'constants/API';
import Claims from 'constants/claims';
import { ENVIRONMENT } from 'constants/environment';
import { PropertyTypes } from 'constants/propertyTypes';
import { DisposeWorkflowStatus, ReviewWorkflowStatus } from 'features/projects/constants';
import { IProject as IProjectDetail } from 'features/projects/interfaces';
import { IStatus } from 'features/projects/interfaces';
import { WorkflowStatus } from 'hooks/api/projects';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import useCodeLookups from 'hooks/useLookupCodes';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { FaFileAlt, FaFileExcel, FaFolder, FaFolderOpen } from 'react-icons/fa';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
import styled from 'styled-components';
import { mapLookupCodeWithParentString, mapStatuses } from 'utils';
import download from 'utils/download';

import service from '../apiService';
import {
  deletePotentialSubdivisionParcels,
  deleteProjectWarning,
  fetchProjectStatuses,
} from '../common';
import { toFlatProject } from '../common/projectConverter';
import { IProject, IProjectFilter } from '.';
import { Columns as cols } from './columns';
import { Properties } from './properties';

interface IProjectFilterState {
  name?: string;
  statusId?: string[];
  notStatusId?: string[];
  agencyId?: string;
  agencies?: number[];
  fiscalYear?: number | '';
}
interface IProps {
  filterable?: boolean;
  title: string;
  defaultFilter?: IProjectFilterState;
  statusOptions?: IStatus[];
  showDefaultStatusOptions?: boolean;
}

const initialValues: IProjectFilterState = {
  name: '',
  statusId: [],
  notStatusId: ['16', '20', '23', '32'], // Denied, Transferred-GRE, Cancelled, Disposed
  agencyId: '',
  agencies: [],
  fiscalYear: '',
};

/**
 * A list view paging table to search for projects.
 * @param param0 ProjectListView properties.
 * @returns ProjectListView component.
 */
export const ProjectListView: React.FC<IProps> = ({
  filterable,
  title,
  defaultFilter = initialValues,
  statusOptions,
  showDefaultStatusOptions = true,
}) => {
  const lookupCodes = useCodeLookups();
  const agencies = useMemo(() => lookupCodes.getByType(API.AGENCY_CODE_SET_NAME), [lookupCodes]);
  const projectStatuses = useAppSelector((store) => store.statuses);
  const keycloak = useKeycloakWrapper();
  const [deleteProjectNumber, setDeleteProjectNumber] = React.useState<string | undefined>();
  const [deletedProject, setDeletedProject] = React.useState<IProjectDetail | undefined>();
  const agencyIds = useMemo(() => (agencies ?? []).map((x) => parseInt(x.id, 10)), [agencies]);
  const agencyOptions = (agencies ?? []).map((c) =>
    mapLookupCodeWithParentString(c, agencies ?? []),
  );
  const statuses = statusOptions
    ? (statusOptions ?? []).map((s) => mapStatuses(s))
    : (projectStatuses ?? []).map((c) => mapStatuses(c));
  const columns = useMemo(() => cols, []);

  // We'll start our table without any data
  const [data, setData] = useState<IProject[] | undefined>(undefined);
  const hasSubdivisions = deletedProject?.properties?.some(
    (p) => p.propertyTypeId === PropertyTypes.SUBDIVISION,
  );

  // Filtering and pagination state
  const [filter, setFilter] = useState<IProjectFilterState>({
    ...defaultFilter,
    statusId: showDefaultStatusOptions ? defaultFilter.statusId : [],
  });
  const [clearSelected, setClearSelected] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [projectCount, setProjectCount] = useState(0);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const route = location.pathname;

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
      if ((value as any).statusId.length === 0) {
        setFilter({ ...value });
      } else if ((value as any).statusId) {
        setFilter({
          ...value,
          statusId: (value as any).statusId?.map((x: any) => x),
          notStatusId: [],
        });
      }
      setPageIndex(0); // Go to first page of results when filter changes
    },
    [setFilter, setPageIndex],
  );
  const onPageSizeChanged = useCallback((size: number) => {
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
          filter: {
            ...filter,
            notStatusId: filter?.statusId?.length ? [] : filter?.notStatusId,
            statusId: filter?.statusId?.length ? filter.statusId : defaultFilter.statusId,
          },
        });
        const data = await service.getProjectList(query);

        // The server could send back total page count.
        // For now we'll just calculate it.
        setData(
          data.items.map((project: IProject) => {
            return project;
          }),
        );
        setProjectCount(data.total);
        setPageCount(Math.ceil(data.total / pageSize));

        // Send data to SnowPlow.
        window.snowplow('trackSelfDescribingEvent', {
          schema: 'iglu:ca.bc.gov.pims/search/jsonschema/1-0-0',
          data: {
            view: location.pathname.includes('/spl') ? 'spl_projects' : 'agency_projects',
            agency:
              filter.agencies?.length === 0
                ? ''
                : lookupCodes.getAgencyFullNameById(Number(filter.agencies)),
            project_name_number: filter.name ?? '',
            fiscal_year: filter.fiscalYear ?? '',
            statuses: filter.statusId?.join(',') ?? '',
          },
        });
      }
    },
    [defaultFilter.statusId],
  );

  // Listen for changes in pagination and use the state to fetch our new data
  useDeepCompareEffect(() => {
    route.startsWith('/projects') && fetchProjectStatuses()(dispatch);
    fetchData({ pageIndex, pageSize, filter, agencyIds });
  }, [fetchData, pageIndex, pageSize, filter, agencyIds, dispatch, route]);

  const fetch = (accept: 'csv' | 'excel', reportType: 'generic' | 'spl') => {
    const query = getServerQuery({ pageIndex, pageSize, filter, agencyIds });
    return download({
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
    })(dispatch);
  };

  const handleDelete = async () => {
    const project = data?.find((p) => p.projectNumber === deleteProjectNumber);
    if (project) {
      project.status = projectStatuses.find((x: any) => x.name === project.status)!;
      dispatch(showLoading());
      const deletedProject = await service.deleteProject(project);
      dispatch(hideLoading());
      setData(data?.filter((p) => p.projectNumber !== project.projectNumber));
      setDeleteProjectNumber(undefined);
      setDeletedProject(toFlatProject(deletedProject));
    }
  };

  const initiateDelete = (projectNumber: string) => {
    setDeleteProjectNumber(projectNumber);
  };

  const onRowClick = (row: IProject) => {
    const DisposalStatuses = Object.keys(DisposeWorkflowStatus).map(
      (k: string) => (DisposeWorkflowStatus as any)[k],
    );
    const ReviewStatuses = Object.keys(ReviewWorkflowStatus).map(
      (k: string) => (ReviewWorkflowStatus as any)[k],
    );
    if (
      (DisposalStatuses.includes(row.statusCode) || ReviewStatuses.includes(row.statusCode)) &&
      row.statusCode !== WorkflowStatus.Disposed
    ) {
      navigate(`/projects?projectNumber=${row.projectNumber}`);
    } else {
      if (keycloak.hasClaim(Claims.ADMIN_PROJECTS)) {
        navigate(`/projects/disposal/${row.id}`);
      } else {
        navigate(`/projects/summary?projectNumber=${row.projectNumber}`);
      }
    }
  };

  const lazyLoadProperties = async (expandedRows: IProject[]) => {
    if (expandedRows.length > 0) {
      expandedRows = expandedRows.filter((x) => x.properties.length === 0);
      const properties = await Promise.all(
        expandedRows.map(async (project) => await service.loadProperties(project.projectNumber)),
      );
      const projectPropertiesMap = properties.reduce((map: any, current: any) => {
        const ids = Object.keys(current);
        const projectId = ids[0];
        return { ...map, [projectId]: current[projectId] };
      }, {});
      setData(
        data?.map((d) => {
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
      .map((i) => {
        const year = startYear + i;
        return { label: `${year - 1} / ${year}`, value: year, parent: '' };
      })
      .reverse();
  }, []);

  return (
    <Container
      fluid
      className="ProjectListView"
      data-testid={
        title.includes('SPL Projects')
          ? 'disposal-projects-spl-project-list-view'
          : title.includes('Approval Requests')
            ? 'disposal-projects-project-approval-request-list-view'
            : 'disposal-projects-project-list-view'
      }
    >
      <div className="filter-container">
        {filterable && (
          <FilterBar<IProjectFilterState> initialValues={filter} onChange={handleFilterChange}>
            <Col md="auto" className="bar-item">
              <Input
                style={{ width: '280px' }}
                field="name"
                placeholder="Search by project name or number"
              />
            </Col>
            <Col md="auto" className="bar-item" style={{ width: '350px' }}>
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
            <Col md="auto" className="bar-item" style={{ marginRight: '-25px' }}>
              <ParentSelect
                field="agencies"
                options={agencyOptions}
                filterBy={['code', 'label', 'parent']}
                placeholder="Enter an Agency"
              />
            </Col>
            <Col md="auto" className="bar-item" style={{ marginLeft: '13px', marginRight: '8px' }}>
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
          <h3 className="mr-4" data-testid="project-list-view-page-title">
            {title}
          </h3>
          <h6 className="ProjectCountHeader">Found {projectCount} projects.</h6>
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
        <Table<IProject, any>
          name="projectsTable"
          clickableTooltip="View Disposal Project details"
          columns={columns(initiateDelete, isAdmin, projectEditClaim, user)}
          data={data || []}
          loading={data === undefined}
          onRequestData={handleRequestData}
          pageCount={pageCount}
          pageSize={pageSize}
          pageIndex={pageIndex}
          onRowClick={onRowClick}
          detailsPanel={{
            render: (project) => <Properties data={project.properties} />,
            icons: {
              open: <FaFolderOpen color="black" size={20} />,
              closed: <FaFolder color="black" size={20} />,
            },
            checkExpanded: (row, state) =>
              !!state.find((x) => x.projectNumber === row.projectNumber),
            onExpand: lazyLoadProperties,
            getRowId: (row) => row.projectNumber,
          }}
          onPageSizeChange={onPageSizeChanged}
        />
      </div>
    </Container>
  );
};

const getProjectReportUrl = (filter: IProjectFilter) => {
  const queryParams = new URLSearchParams();
  for (const [key, value] of Object.entries(filter ?? {})) {
    queryParams.set(key, String(value));
  }
  return `${ENVIRONMENT.apiUrl}/reports/projects?${queryParams.toString()}`;
};

export const getProjectFinancialReportUrl = (filter?: IProjectFilter) => {
  const queryParams = new URLSearchParams();
  for (const [key, value] of Object.entries(filter ?? {})) {
    queryParams.set(key, String(value));
  }
  return `${ENVIRONMENT.apiUrl}/reports/projects/surplus/properties/list?${queryParams.toString()}`;
};

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

const projectListView = () => <ProjectListView title="My Agency's Projects" filterable={true} />;
export default projectListView;
