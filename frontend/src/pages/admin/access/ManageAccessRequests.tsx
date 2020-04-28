import {
  getAccessRequestsAction,
  getAccessRequestsFilterAction,
  getAccessRequestsSelectAction,
  getAccessRequestsSortAction,
} from 'actionCreators/accessRequestActionCreator';
import { IGenericNetworkAction } from 'actions/genericActions';
import { GridApi } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import * as actionTypes from 'constants/actionTypes';
import * as API from 'constants/API';
import { IAccessRequest } from 'interfaces';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { IAccessRequestState } from 'reducers/accessRequestReducer';
import { RootState } from 'reducers/rootReducer';
import { IPaginate, toApiPaginateParams } from 'utils/CommonFunctions';
import { columnDefinitions } from './constants/constants';
import { AccessRequestActions } from './components/AccessRequestActions';

import './ManageAccessRequests.scss';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { AccessRequestStatus } from 'constants/accessStatus';

const ManageAccessRequests = () => {
  const dispatch = useDispatch();
  const MAX_ACCESS_RESULTS_PER_PAGE = 100;
  const pagedAccessRequests = useSelector<RootState, IPaginate>(
    state => (state.accessRequest as IAccessRequestState)?.pagedAccessRequests,
  );

  const [selectedRequests, setSelectedRequests] = useState<IAccessRequest[]>([]);

  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  const requestAccess = useSelector<RootState, IGenericNetworkAction>(
    state => (state.network as any)[actionTypes.GET_REQUEST_ACCESS] as IGenericNetworkAction,
  );

  const updateRequestAccessAdmin = useSelector<RootState, IGenericNetworkAction>(
    state =>
      (state.network as any)[actionTypes.UPDATE_REQUEST_ACCESS_ADMIN] as IGenericNetworkAction,
  );

  useEffect(() => {
    if (!updateRequestAccessAdmin?.isFetching) {
      const paginateParams: API.IPaginateAccessRequests = toApiPaginateParams(
        0,
        MAX_ACCESS_RESULTS_PER_PAGE,
      );
      paginateParams.status = AccessRequestStatus.OnHold;
      dispatch(getAccessRequestsAction(paginateParams));
    }
  }, [updateRequestAccessAdmin, dispatch]);

  const updateSelectionList = () => {
    setSelectedRequests(gridApi?.getSelectedNodes().map(x => x.data) || []);
    dispatch(getAccessRequestsSelectAction(gridApi?.getSelectedNodes().map(x => x.id) || []));
  };

  const setFilterModel = () => {
    dispatch(getAccessRequestsFilterAction(gridApi?.getFilterModel() || {}));
  };

  const setSortModel = () => {
    dispatch(getAccessRequestsSortAction(gridApi?.getSortModel() || []));
  };

  const clearFilter = () => {
    gridApi?.setFilterModel({});
  };

  return requestAccess && !requestAccess.isFetching ? (
    <Container fluid={true} className="manage-access-requests">
      <Row className="header">
        <Col className="title">
          <p>PIMS Guests (Pending Approval)</p>
          <span className="fill-remaining-space"></span>
          <div className="actions">
            <AccessRequestActions selections={selectedRequests} />
            <Button onClick={clearFilter} variant="light">
              Reset filter
            </Button>
          </div>
        </Col>
      </Row>
      <Row className="requests-datatable">
        <Col className="ag-theme-balham" style={{ width: '100%', minHeight: 500 }} sm={12}>
          <AgGridReact
            onRowSelected={() => updateSelectionList()}
            getRowNodeId={(data: IAccessRequest) => `${data.id}`}
            rowSelection="multiple"
            suppressRowClickSelection={true}
            rowHeight={50}
            headerHeight={50}
            pagination={true}
            paginationPageSize={10}
            columnDefs={columnDefinitions()}
            rowData={pagedAccessRequests.items as IAccessRequest[]}
            onGridReady={e => setGridApi(e.api)}
            floatingFilter={true}
            onFilterChanged={setFilterModel}
            onSortChanged={setSortModel}
          ></AgGridReact>
        </Col>
      </Row>
    </Container>
  ) : (
    <Spinner animation="border"></Spinner>
  );
};

export default ManageAccessRequests;
