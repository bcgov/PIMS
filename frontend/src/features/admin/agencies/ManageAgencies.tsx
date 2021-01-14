import './ManageAgencies.scss';
import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Table } from 'components/Table';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { columnDefinitions } from '../constants';
import { IAgenciesState } from 'reducers/agencyReducer';
import { IAgency, IAgencyDetail, IAgencyFilter, IAgencyRecord, IPagedItems } from 'interfaces';
import { getAgenciesAction } from 'actionCreators/agencyActionCreator';
import { toFilteredApiPaginateParams } from 'utils/CommonFunctions';
import { TableSort } from 'components/Table/TableSort';
import { IGenericNetworkAction } from 'actions/genericActions';
import * as actionTypes from 'constants/actionTypes';
import { generateMultiSortCriteria } from 'utils';
import { AgencyFilterBar } from './AgencyFilterBar';
import useCodeLookups from 'hooks/useLookupCodes';
import { useHistory } from 'react-router-dom';
import { getFetchLookupCodeAction } from 'actionCreators/lookupCodeActionCreator';
import { isEmpty } from 'lodash';

const ManageAgencies: React.FC = () => {
  const columns = useMemo(() => columnDefinitions, []);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState<IAgencyFilter>({});
  const lookupCodes = useCodeLookups();
  const agencyLookupCodes = lookupCodes.getByType('Agency');
  const history = useHistory();

  const pagedAgencies = useSelector<RootState, IPagedItems<IAgency>>(state => {
    return (state.agencies as IAgenciesState).pagedAgencies;
  });

  const pageSize = useSelector<RootState, number>(state => {
    return (state.agencies as IAgenciesState).rowsPerPage;
  });

  const pageIndex = useSelector<RootState, number>(state => {
    return (state.agencies as IAgenciesState).pageIndex;
  });

  const sort = useSelector<RootState, TableSort<IAgencyDetail>>(state => {
    return (state.agencies as IAgenciesState).sort;
  });

  const agencies = useSelector<RootState, IGenericNetworkAction>(
    state => (state.network as any)[actionTypes.GET_AGENCIES] as IGenericNetworkAction,
  );

  const onRowClick = (row: IAgencyRecord) => {
    history.push(`/admin/agency/${row.id}`);
  };

  let agencyList = pagedAgencies.items.map(
    (a: IAgency): IAgencyRecord => ({
      name: a.name,
      code: a.code,
      description: a.description,
      parentId: a.parentId,
      id: a.id,
      parent: agencyLookupCodes.find(x => x.id === a.parentId)?.name,
    }),
  );

  const defaultValue: IAgencyFilter = {
    id: undefined,
  };
  const initialValues = useMemo(() => {
    const values = { ...defaultValue, ...filter };
    if (typeof values.id === 'number') {
      const agency = agencyLookupCodes.find(x => Number(x.id) === values?.id) as any;
      if (agency) {
        values.id = agency;
      }
    }
    return values;
  }, [agencyLookupCodes, filter, defaultValue]);
  const onRequestData = useCallback(
    ({ pageIndex }) => {
      dispatch(
        getAgenciesAction(
          toFilteredApiPaginateParams<IAgencyFilter>(
            filter?.id ? 0 : pageIndex,
            pageSize,
            sort && !isEmpty(sort) ? generateMultiSortCriteria(sort) : undefined,
            filter,
          ),
        ),
      );
    },
    [dispatch, filter, pageSize, sort],
  );

  useEffect(() => {
    dispatch(getFetchLookupCodeAction());
  }, [history, dispatch]);

  return (
    <Container fluid className="ManageAgencies">
      <Container fluid className="agency-toolbar">
        <AgencyFilterBar
          value={{ ...initialValues }}
          onChange={value => {
            if ((value as any).id) {
              setFilter({ ...filter, id: Number((value as any).id) });
            } else {
              setFilter({ ...initialValues, id: undefined });
            }
          }}
          handleAdd={() => {
            history.push('/admin/agency/new');
          }}
        />
      </Container>
      <div className="table-section">
        <Table<IAgencyRecord>
          name="agenciesTable"
          columns={columns}
          pageIndex={pageIndex}
          data={agencyList}
          onRowClick={onRowClick}
          onRequestData={onRequestData}
          pageSize={pageSize}
          pageCount={Math.ceil(pagedAgencies.total / pageSize)}
          loading={!(agencies && !agencies.isFetching)}
          lockPageSize={true}
          clickableTooltip="View agency details"
        />
      </div>
    </Container>
  );
};

export default () => <ManageAgencies />;
