import './ManageAgencies.scss';

import { Table } from 'components/Table';
import * as actionTypes from 'constants/actionTypes';
import useCodeLookups from 'hooks/useLookupCodes';
import { IAgency, IAgencyFilter, IAgencyRecord } from 'interfaces';
import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { IGenericNetworkAction } from 'store';
import { useAppDispatch, useAppSelector } from 'store';
import { getAgenciesAction } from 'store/slices/hooks/agencyActionCreator';
import { getFetchLookupCodeAction } from 'store/slices/hooks/lookupCodeActionCreator';
import { generateMultiSortCriteria } from 'utils';
import { toFilteredApiPaginateParams } from 'utils/CommonFunctions';

import { columnDefinitions } from '../constants/columns';
import { AgencyFilterBar } from './AgencyFilterBar';

const ManageAgencies: React.FC = () => {
  const columns = useMemo(() => columnDefinitions, []);
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<IAgencyFilter>({});
  const lookupCodes = useCodeLookups();
  const agencyLookupCodes = lookupCodes.getByType('Agency');
  const navigate = useNavigate();

  const pagedAgencies = useAppSelector((store) => store.agencies.pagedAgencies);
  const pageSize = useAppSelector((store) => store.agencies.rowsPerPage);
  const pageIndex = useAppSelector((store) => store.agencies.pageIndex);
  const sort = useAppSelector((store) => store.agencies.sort);
  const agencies = useAppSelector(
    (store) => (store.network.requests as any)[actionTypes.GET_AGENCIES] as IGenericNetworkAction,
  );

  const onRowClick = (row: IAgencyRecord) => {
    navigate(`/admin/agency/${row.id}`);
  };

  const agencyList = pagedAgencies.items.map(
    (a: IAgency): IAgencyRecord => ({
      name: a.name,
      code: a.code,
      description: a.description,
      parentId: a.parentId,
      id: a.id,
      parent: agencyLookupCodes.find((x) => x.id === a.parentId)?.name,
    }),
  );

  const initialValues = useMemo(() => {
    const defaultValue: IAgencyFilter = {
      id: undefined,
    };
    const values = { ...defaultValue, ...filter };
    if (typeof values.id === 'number') {
      const agency = agencyLookupCodes.find((x) => Number(x.id) === values?.id) as any;
      if (agency) {
        values.id = agency;
      }
    }
    return values;
  }, [agencyLookupCodes, filter]);

  const onRequestData = useCallback(
    ({ pageIndex }: { pageIndex: number }) => {
      getAgenciesAction(
        toFilteredApiPaginateParams<IAgencyFilter>(
          filter?.id ? 0 : pageIndex,
          pageSize,
          sort && !isEmpty(sort) ? generateMultiSortCriteria(sort) : undefined,
          filter,
        ),
      )(dispatch);
    },
    [dispatch, filter, pageSize, sort],
  );

  useEffect(() => {
    getFetchLookupCodeAction()(dispatch);
  }, [dispatch]);

  return (
    <Container fluid className="ManageAgencies" data-testid="admin-agencies-page">
      <Container fluid className="agency-toolbar">
        <AgencyFilterBar
          value={{ ...initialValues }}
          onChange={(value) => {
            if ((value as any).id) {
              setFilter({ ...filter, id: Number((value as any).id) });
            } else {
              setFilter({ ...initialValues, id: undefined });
            }
          }}
          handleAdd={() => {
            navigate('/admin/agency/new');
          }}
        />
      </Container>
      <div className="table-section">
        <Table<IAgencyRecord, any>
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

export default ManageAgencies;
