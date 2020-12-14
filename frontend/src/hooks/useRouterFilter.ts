import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import React, { useState } from 'react';
import { saveFilter } from 'reducers/filterSlice';
import { RootState } from 'reducers/rootReducer';
import _ from 'lodash';
import queryString from 'query-string';
import { TableSort } from 'components/Table/TableSort';
import { generateMultiSortCriteria, resolveSortCriteriaFromUrl } from 'utils';

/**
 * Extract the specified properties from the source object.
 * Does not extract 'undefined' property values.
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
 * Control the state of the passed filter using url search params.
 * The filter type of 'T' should be a flat object with properties that are only string.
 * NOTE: URLSearchParams not supported by IE.
 */
export const useRouterFilter = <T extends object>(
  /** Initial filter that will be applied to the URL and stored in redux. */
  filter: T,
  /** Change the state of the filter. */
  setFilter: (filter: T) => void,
  /** Redux key */
  key: string,
  sorting?: TableSort<any>,
  setSorting?: (sorting: TableSort<any>) => void,
) => {
  const history = useHistory();
  const reduxSearch = useSelector<RootState, any>(state => state.filter);
  const [savedFilter] = useState(reduxSearch);
  const dispatch = useDispatch();

  // Extract the query parameters to initialize the filter.
  // This will only occur the first time the component loads to ensure the URL query parameters are applied.
  React.useEffect(() => {
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
  }, []);

  // If the 'filter' changes save it to redux store and update the URL.
  React.useEffect(() => {
    const filterParams = new URLSearchParams(filter as any);
    const sort = generateMultiSortCriteria(sorting!);
    const allParams = {
      ...queryString.parse(history.location.search),
      ...queryString.parse(filterParams.toString()),
      sort,
    };
    history.push({
      pathname: history.location.pathname,
      search: queryString.stringify(allParams, { skipEmptyString: true, skipNull: true }),
    });
    const keyedFilter = { [key]: filter };
    dispatch(saveFilter({ ...savedFilter, ...keyedFilter }));
  }, [history, key, filter, savedFilter, dispatch, sorting]);

  return;
};
