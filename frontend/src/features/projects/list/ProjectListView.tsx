import './ProjectListView.scss';

import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
import { FaFolder, FaFolderOpen } from 'react-icons/fa';
import { Properties } from './properties';
import FilterBar from 'components/SearchBar/FilterBar';
import { Col, Form } from 'react-bootstrap';
import { Input } from 'components/common/form';
import { Field } from 'formik';
import GenericModal from 'components/common/GenericModal';
import { useHistory } from 'react-router-dom';
import { ReviewWorkflowStatus } from '../dispose';

interface IProjectFilterState {
  active?: boolean;
  createdByMe?: boolean;
  name?: string;
  statusId?: number;
  accessDisposal?: boolean;
}

const initialQuery: IProjectFilter = {
  page: 1,
  quantity: 10,
};

const getServerQuery = (state: {
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
  const [deleteId, setDeleteId] = React.useState<string | undefined>();
  const agencyIds = useMemo(() => agencies.map(x => parseInt(x.id, 10)), [agencies]);
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
          filter: mode === PageMode.APPROVAL ? { ...filter, accessDisposal: true } : filter,
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

  // Listen for changes in pagination and use the state to fetch our new data
  useEffect(() => {
    fetchData({ pageIndex, pageSize, filter, agencyIds });
  }, [fetchData, pageIndex, pageSize, filter, agencyIds]);

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
    if (row.statusId >= ReviewWorkflowStatus.PropertyReview) {
      history.push(`/dispose/projects/assess/properties?projectNumber=${row.projectNumber}`);
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
        {filterable ? (
          <FilterBar<IProjectFilterState>
            initialValues={filter}
            onSearch={values => setFilter(values)}
            onReset={() => setFilter({})}
          >
            <Col>
              <h4>{title}</h4>
            </Col>
            <Col className="bar-item">
              <Form.Group>
                <Form.Label>Active Projects:&nbsp;</Form.Label>
                <Field name="active" label="Active Projects" type="checkbox" />
              </Form.Group>
            </Col>
            <Col className="bar-item">
              <Form.Group>
                <Form.Label>My projects:&nbsp;</Form.Label>
                <Field name="createdByMe" type="checkbox" />
              </Form.Group>
            </Col>
            <Col className="bar-item">
              <Input field="name" placeholder="Search by project name" />
            </Col>
          </FilterBar>
        ) : (
          <div className="title">
            <h4>{title}</h4>
          </div>
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
        <Table<IProject>
          name="projectsTable"
          columns={mode === PageMode.APPROVAL ? columns() : columns(initiateDelete)}
          data={data}
          onRequestData={handleRequestData}
          pageCount={pageCount}
          onRowClick={onRowClick}
          detailsPanel={{
            render: project => <Properties data={project.properties} />,
            icons: { open: <FaFolderOpen color="black" />, closed: <FaFolder color="black" /> },
            checkExpanded: (row, state) => !!state.find(x => x.projectNumber === row.projectNumber),
            onExpand: lazyLoadProperties,
            getRowId: row => row.projectNumber,
          }}
          onPageSizeChange={size => {
            setPageSize(size);
          }}
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

export default () => <ProjectListView filterable={true} title="My Agency's Projects" />;
