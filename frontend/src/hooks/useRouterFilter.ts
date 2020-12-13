import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import React, { useState } from 'react';
import { saveFilter } from 'reducers/filterSlice';
import { RootState } from 'reducers/rootReducer';
import _ from 'lodash';
import queryString from 'query-string';
import { TableSort } from 'components/Table/TableSort';
import { generateMultiSortCriteria, resolveSortCriteriaFromUrl } from 'utils';
import { useMount } from './useMount';

/**
 * Extract the specified properties from the source object.
 * Does not extract 'undefined' property values.
 * This provides a consistent deconscrutor implementation.
 * For some reason the following will not work `const result: T = source;`.
 * @param props An array of property names.
 * @param source The source object that the properties will be extracted from.
 * @returns A new object composed of the extracted properties.
 */
const extractProps = (props: string[], source: any): any => {
  var dest = {} as any;
  props.forEach(p => {
    if (source[p] !== undefined) dest[p] = source[p];
  });
  return dest;
};

/**
 * RouterFilter hook properties.
 */
export interface IRouterFilterProps<T> {
  /** Initial filter that will be applied to the URL and stored in redux. */
  filter: T;
  /** Change the state of the filter. */
  setFilter: (filter: T) => void;
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
  const history = useHistory();
  const reduxSearch = useSelector<RootState, any>(state => state.filter);
  const [savedFilter] = useState(reduxSearch);
  const dispatch = useDispatch();

  // Extract the query parameters to initialize the filter.
  // This will only occur the first time the component loads to ensure the URL query parameters are applied.
  useMount(() => {
    const params = queryString.parse(history.location.search);
    // Check if query contains filter params.
    const filterProps = Object.keys(filter);
    if (_.intersection(Object.keys(params), filterProps).length) {
      let merged = extractProps(filterProps, params);
      // Only change state if the query parameters are different than the default filter.
      if (!_.isEqual(merged, filter)) setFilter(merged);
    } else if (savedFilter?.hasOwnProperty(key)) {
      let merged = extractProps(filterProps, savedFilter[key]);
      // Only change state if the saved filter is different than the default filter.
      if (!_.isEqual(merged, filter)) setFilter(merged);
    }

    if (params.sort && setSorting) {
      const sort = resolveSortCriteriaFromUrl(
        typeof params.sort === 'string' ? [params.sort] : params.sort,
      );
      if (!_.isEmpty(sort)) {
        setSorting(sort as any);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  // If the 'filter' changes save it to redux store and update the URL.
  React.useEffect(() => {
    const filterParams = new URLSearchParams(filter as any);
    const sorting = generateMultiSortCriteria(sort!);
    const allParams = {
      ...queryString.parse(history.location.search),
      ...queryString.parse(filterParams.toString()),
      sorting,
    };
    history.push({
      pathname: history.location.pathname,
      search: queryString.stringify(allParams, { skipEmptyString: true, skipNull: true }),
    });
    const keyedFilter = { [key]: filter };
    dispatch(saveFilter({ ...savedFilter, ...keyedFilter }));
  }, [history, key, filter, savedFilter, dispatch, sort]);

  return;
};
