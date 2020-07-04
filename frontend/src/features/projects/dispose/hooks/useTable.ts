import React, { useCallback } from 'react';
import { IPropertyFilter, IFilterBarState } from '../../common';
import { decimalOrUndefined } from 'utils';
import { ENVIRONMENT } from 'constants/environment';
import CustomAxios from 'customAxios';
import { IPagedItems } from 'interfaces';
import { IProperty } from 'actions/parcelsActions';
import { IProperty as IRowProperty } from '../../common';
import queryString from 'query-string';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';

const initialQuery: IPropertyFilter = {
  page: 1,
  quantity: 10,
};

const getServerQuery = (state: {
  pageIndex: number;
  pageSize: number;
  filter: IFilterBarState;
  agencyIds: number[];
}) => {
  const {
    pageIndex,
    pageSize,
    agencyIds,
    filter: {
      address,
      municipality,
      projectNumber,
      classificationId,
      agencies,
      minLotSize,
      maxLotSize,
    },
  } = state;

  // show properties for all agencies if none selected in the agency filter
  let parsedAgencies = [...agencyIds];
  if (agencies !== null && agencies !== undefined && agencies !== '') {
    parsedAgencies = [parseInt(agencies, 10)];
  }

  const query: IPropertyFilter = {
    ...initialQuery,
    address,
    municipality,
    projectNumber,
    ignorePropertiesInProjects: true,
    classificationId: decimalOrUndefined(classificationId),
    agencies: parsedAgencies,
    minLandArea: decimalOrUndefined(minLotSize),
    maxLandArea: decimalOrUndefined(maxLotSize),
    statusId: undefined, // TODO: this field is not yet implemented in FilterBar
    page: pageIndex + 1,
    quantity: pageSize,
  };
  return query;
};

const getPropertyListUrl = (filter: IPropertyFilter) =>
  `${ENVIRONMENT.apiUrl}/properties/search/page?${filter ? queryString.stringify(filter) : ''}`;

interface UseTableProps {
  fetchIdRef: React.MutableRefObject<number>;
  setData: Function;
  setPageCount: Function;
}

function transformData(data: IRowProperty[]) {
  data.forEach(property => {
    property.address = `${property.address}, ${property.city}`;
  });
  return data;
}

function useTable({ fetchIdRef, setData, setPageCount }: UseTableProps) {
  const keycloak = useKeycloakWrapper();
  const fetchData = useCallback(
    async ({
      pageIndex,
      pageSize,
      filter,
      agencyIds,
    }: {
      pageIndex: number;
      pageSize: number;
      filter: IFilterBarState;
      agencyIds: number[];
    }) => {
      // Give this fetch an ID
      const fetchId = ++fetchIdRef.current;

      // TODO: Set the loading state
      // setLoading(true);
      // Agencies must be part of the user's agency.
      agencyIds = keycloak.agencyIds;

      // Only update the data if this is the latest fetch
      if (fetchId === fetchIdRef.current && agencyIds?.length > 0) {
        const query = getServerQuery({ pageIndex, pageSize, filter, agencyIds: agencyIds });
        const response = await CustomAxios().get<IPagedItems<IProperty>>(getPropertyListUrl(query));

        // The server could send back total page count.
        // For now we'll just calculate it.
        setData(transformData(response.data.items as IRowProperty[]));
        setPageCount(Math.ceil(response.data.total / pageSize));

        // setLoading(false);
      }
    },
    [fetchIdRef, keycloak.agencyIds, setData, setPageCount],
  );

  return fetchData;
}

export default useTable;
