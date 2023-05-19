import { TableSort } from 'components/Table/TableSort';
import { PropertyTypeNames } from 'constants/propertyTypeNames';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
import { saveFilter } from 'store/slices/filterSlice';
import { generateMultiSortCriteria, resolveSortCriteriaFromUrl } from 'utils';

/**
 * Extract the specified properties from the source object.
 * Does not extract 'undefined' property values.
 * This provides a consistent deconstructor implementation.
 * For some reason the following will not work `const result: T = source;`.
 * @param props An array of property names.
 * @param source The source object that the properties will be extracted from.
 * @returns A new object composed of the extracted properties.
 */
const extractProps = (props: string[], source: any): any => {
  const dest = {} as any;
  props.forEach((p) => {
    if (source[p] !== undefined) {
      if (source[p] === 'true') {
        dest[p] = true;
      } else if (source[p] === 'false') {
        dest[p] = false;
      } else {
        dest[p] = source[p];
      }
    }
  });
  return dest;
};

const defaultFilter = {
  address: '',
  administrativeArea: '',
  agencies: '',
  classificationId: '',
  includeAllProperties: '',
  maxAssessedValue: '',
  maxLotSize: '',
  maxMarketValue: '',
  maxNetBookValue: '',
  minLotSize: '',
  name: '',
  pid: '',
  projectNumber: '',
  propertyType: '',
  rentableArea: '',
  searchBy: 'address',
};

/**
 * RouterFilter hook properties.
 */
export interface IRouterFilterProps<T> {
  /** Initial filter that will be applied to the URL and stored in redux. */
  filter: T;
  /** Change the state of the filter. */
  setFilter: null | ((filter: T) => void);
  /** Redux key */
  key: string;
  sort?: TableSort<any>;
  setSorting?: (sort: TableSort<any>) => void;
}

/**
 * A generic hook that will extract the query parameters from the URL, store them in a redux store
 * and update the URL any time the specified 'filter' is updated.
 * On Mount it will extract the URL query parameters or pull from the redux store and set the specied 'filter'.
 *
 * The filter type of 'T' should be a flat object with properties that are only string.
 * NOTE: URLSearchParams not supported by IE.
 */
export const useRouterFilter = <T extends object>({
  filter,
  setFilter,
  key,
  sort,
  setSorting,
}: IRouterFilterProps<T>) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const reduxSearch = useAppSelector((store) => store.filter);
  const [savedFilter] = useState(reduxSearch);
  const [loaded, setLoaded] = useState(false);

  // Extract the query parameters to initialize the filter.
  // This will only occur the first time the component loads to ensure the URL query parameters are applied.
  useEffect(() => {
    if (setFilter) {
      const queryParams = new URLSearchParams(location.search);
      const params: any = {};
      for (const [key, value] of queryParams.entries()) {
        params[key] = value;
      }
      // Check if query contains filter params.
      const filterProps = Object.keys(filter);
      if (_.intersection(Object.keys(params), filterProps).length) {
        let merged = { ...defaultFilter, ...extractProps(filterProps, params) };
        if (!merged.propertyType) {
          merged = { ...merged, propertyType: PropertyTypeNames.Land };
        }
        // Only change state if the query parameters are different than the default filter.
        if (!_.isEqual(_.omit(merged, 'propertyType'), _.omit(filter, 'propertyType')))
          setFilter(merged);
      } else if (savedFilter?.hasOwnProperty(key)) {
        let merged = { ...defaultFilter, ...extractProps(filterProps, (savedFilter as any)[key]) };
        if (!merged.propertyType) {
          merged = { ...merged, propertyType: PropertyTypeNames.Land };
        }
        // Only change state if the saved filter is different than the default filter.
        if (!_.isEqual(_.omit(merged, 'propertyType'), _.omit(filter, 'propertyType')))
          setFilter(merged);
      }

      if (params.sorting && setSorting) {
        const sort = resolveSortCriteriaFromUrl(
          typeof params.sorting === 'string' && params.sorting !== null
            ? [params.sorting]
            : (params.sorting as string[]),
        );
        if (!_.isEmpty(sort)) {
          setSorting(sort as any);
        }
      }
      setLoaded(true);
    }
  }, [location.pathname]);

  // If the 'filter' changes save it to redux store and update the URL.
  React.useEffect(() => {
    if (loaded) {
      const filterParams = new URLSearchParams(filter as any);
      const sorting = generateMultiSortCriteria(sort!);

      // Original query params parsed.
      const queryParams = new URLSearchParams(location.search);
      const originalParamsParsed: any = {};
      for (const [key, value] of queryParams.entries()) {
        originalParamsParsed[key] = value;
      }

      // Filtered query params parsed.
      const filteredQueryParams = new URLSearchParams(filterParams.toString());
      const filteredParamsParsed: any = {};
      for (const [key, value] of filteredQueryParams.entries()) {
        filteredParamsParsed[key] = value;
      }

      const allParams = {
        ...originalParamsParsed,
        ...filteredParamsParsed,
        sorting,
      };
      const allQueryParams = new URLSearchParams();
      for (const [key, value] of Object.entries(allParams ?? {})) {
        allQueryParams.set(key, String(value));
      }
      allQueryParams.set('skipEmptyString', 'true');
      allQueryParams.set('skipNull', 'true');

      navigate({
        pathname: location.pathname,
        search: allQueryParams.toString(),
      });
      const keyedFilter = { [key]: filter };
      dispatch(saveFilter({ ...savedFilter, ...keyedFilter }));
    }
  }, [
    key,
    filter,
    savedFilter,
    dispatch,
    sort,
    loaded,
    location.search,
    location.pathname,
    navigate,
  ]);

  const updateSearch = useCallback(
    (newFilter: T) => {
      const filterParams = new URLSearchParams(newFilter as any);
      const sorting = generateMultiSortCriteria(sort!);

      // Original query params parsed.
      const queryParams = new URLSearchParams(location.search);
      const originalParamsParsed: any = {};
      for (const [key, value] of queryParams.entries()) {
        originalParamsParsed[key] = value;
      }

      // Filtered query params parsed.
      const filteredQueryParams = new URLSearchParams(filterParams.toString());
      const filteredParamsParsed: any = {};
      for (const [key, value] of filteredQueryParams.entries()) {
        filteredParamsParsed[key] = value;
      }

      const allParams = {
        ...originalParamsParsed,
        ...filteredParamsParsed,
        sorting,
      };
      const allQueryParams = new URLSearchParams();
      for (const [key, value] of Object.entries(allParams ?? {})) {
        allQueryParams.set(key, String(value));
      }
      allQueryParams.set('skipEmptyString', 'true');
      allQueryParams.set('skipNull', 'true');

      navigate({
        pathname: location.pathname,
        search: queryParams.toString(),
      });
      const keyedFilter = { [key]: newFilter };
      dispatch(saveFilter({ ...savedFilter, ...keyedFilter }));
    },
    [sort, location.search, location.pathname, navigate, key, dispatch, savedFilter],
  );

  return {
    updateSearch,
  };
};
