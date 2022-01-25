import useCodeLookups from 'hooks/useLookupCodes';
import { Table } from 'components/Table';
import * as API from 'constants/API';
import React, { useState, useMemo } from 'react';
import { AdminAreaFilterBar } from './AdminAreasFilterBar';
import { useHistory } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import styled from 'styled-components';
import { adminAreasColumnDefinistions } from '../constants/columns';
import { IAdminAreaFilter, IAdministrativeArea } from './interfaces';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { getFetchLookupCodeAction } from 'store/slices/hooks/lookupCodeActionCreator';
import { useAdminAreaApi } from 'hooks/useApiAdminAreas';
import { useAppDispatch } from 'store';

const AdminAreaToolbarContainer = styled(Container)`
  .search-bar {
    justify-content: center;
  }
  .label {
    margin-top: 10px;
    margin-right: 10px;
  }
  h3 {
    margin-right: 50px;
  }
  padding: 0px;
`;

const StyledTable = styled(Table)`
  padding: 1rem 2rem;
  max-height: calc(
    100vh - #{$header-height} - #{$navbar-height} - #{$mapfilter-height} - #{$footer-height}
  );
  table {
    background-color: white;
  }
  padding-right: 25% #important;
`;

/** Component used to list the administrative areas present in the application. User's can select corresponding administrative area they wish to edit here. */
export const ManageAdminAreas = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const lookupCodes = useCodeLookups();
  const columns = useMemo(() => adminAreasColumnDefinistions, []);
  const administrativeAreas = lookupCodes.getByType(API.AMINISTRATIVE_AREA_CODE_SET_NAME);

  const onRowClick = (row: IAdministrativeArea) => {
    history.push(`/admin/administrativeArea/${row.id}`);
  };

  const [areas, setAreas] = useState(undefined);

  const api = useAdminAreaApi();
  const data = useCallback(
    async (params: API.IPaginateParams) => {
      const response = await api.getAdminAreas(params);
      setAreas(response.items);
    },
    [api],
  );

  useEffect(() => {
    if (!areas) {
      data({ page: 0 });
    }
  }, [data, areas]);

  /** make sure lookup codes are updated when administrative area is added or deleted */
  useEffect(() => {
    getFetchLookupCodeAction()(dispatch);
  }, [history, dispatch]);

  const [filter, setFilter] = useState<IAdminAreaFilter>({});
  const onRequestData = useCallback(
    async ({ pageIndex }) => {
      if (!!filter) {
        const response = await api.getAdminAreas({
          page: filter.id ? 0 : pageIndex + 1,
          name: (filter?.id as any)?.name,
        });
        setAreas(response.items);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filter],
  );
  const initialValues = {
    id: undefined,
  };
  return (
    <Container fluid style={{ padding: 0 }}>
      <AdminAreaToolbarContainer fluid className="admin-area-toolbar">
        <AdminAreaFilterBar
          handleAdd={() => history.push('/admin/administrativeArea/new')}
          onChange={value => {
            if ((value as any).id) {
              setFilter({ ...filter, id: (value as any).id });
            } else {
              setFilter({ ...initialValues, name: undefined });
            }
          }}
          value={{ ...initialValues }}
        />
      </AdminAreaToolbarContainer>
      {!!areas ? (
        <StyledTable<any>
          name="adminAreasTable"
          columns={columns}
          data={areas}
          pageCount={Math.ceil(administrativeAreas.length / 10)}
          onRowClick={onRowClick}
          lockPageSize
          onRequestData={onRequestData}
        />
      ) : (
        <Spinner animation="border" />
      )}
    </Container>
  );
};

export default ManageAdminAreas;
