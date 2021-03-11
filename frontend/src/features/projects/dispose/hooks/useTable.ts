import React, { useCallback } from 'react';
import { IPropertyFilter, IFilterBarState } from '../../common';
import { decimalOrUndefined } from 'utils';
import { ENVIRONMENT } from 'constants/environment';
import CustomAxios from 'customAxios';
import { IPagedItems } from 'interfaces';
import { IProperty } from 'actions/parcelsActions';
import { IProperty as IRowProperty } from '../../common';
import queryString from 'query-string';

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
      pid,
      address,
      administrativeArea,
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
    pid,
    address,
    administrativeArea,
    projectNumber,
    ignorePropertiesInProjects: false,
    classificationId: decimalOrUndefined(classificationId),
    agencies: parsedAgencies,
    minLandArea: decimalOrUndefined(minLotSize),
    maxLandArea: decimalOrUndefined(maxLotSize),
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
  setLoading: Function;
}

function transformData(data: IRowProperty[]) {
  data.forEach(property => {
    property.address = `${property.address}, ${property.administrativeArea}`;
  });
  return data;
}

function useTable({ fetchIdRef, setData, setPageCount, setLoading }: UseTableProps) {
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

      // Only update the data if this is the latest fetch
      if (fetchId === fetchIdRef.current && agencyIds?.length > 0) {
        const query = getServerQuery({ pageIndex, pageSize, filter, agencyIds: agencyIds });
        setLoading(true);
        const response = await CustomAxios().get<IPagedItems<IProperty>>(getPropertyListUrl(query));
        // The server could send back total page count.
        // For now we'll just calculate it.
        setData(transformData((response.data?.items ?? []) as IRowProperty[]));
        setPageCount(Math.ceil((response.data?.total ?? 0) / pageSize));

        setLoading(false);
      }
    },
    [fetchIdRef, setData, setLoading, setPageCount],
  );

  return fetchData;
}

export default useTable;
