import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import React, { useState } from 'react';
import { saveFilter } from 'reducers/filterSlice';
import { RootState } from 'reducers/rootReducer';
import _ from 'lodash';
import { BasePropertyFilter } from 'components/common/interfaces';
import queryString from 'query-string';

const defaultFilter: BasePropertyFilter = {
  searchBy: 'address',
  pid: '',
  address: '',
  administrativeArea: '',
  projectNumber: '',
  agencies: '',
  classificationId: '',
  minLotSize: '',
  maxLotSize: '',
};

/**
 * Control the state of the passed filter using url search params.
 * NOTE: URLSearchParams not supported by IE.
 */
export const useRouterFilter = <T extends BasePropertyFilter>(
  filter: T,
  setFilter: (val: T) => void,
  key: string,
) => {
  const history = useHistory();
  const [originalSearch] = useState(history.location.search);
  const reduxSearch = useSelector<RootState, any>(state => state.filter);
  const [originalSearchRedux] = useState(reduxSearch);
  const dispatch = useDispatch();

  //When this hook loads, override the value of the filter with the search params. Should run once as originalSearch should never change.
  React.useEffect(() => {
    const filterFromParams = queryString.parse(originalSearch);
    if (
      Object.keys(defaultFilter).length ===
      _.intersection(Object.keys(filterFromParams), Object.keys(defaultFilter)).length
    ) {
      setFilter(filterFromParams as any);
    } else if (originalSearchRedux?.hasOwnProperty(key) && !!originalSearchRedux[key]?.searchBy) {
      setFilter(originalSearchRedux[key]);
    }
  }, [key, originalSearch, originalSearchRedux, setFilter]);

  //If the filter ever changes, push those changes to the search params
  React.useEffect(() => {
    const filterParams = new URLSearchParams(filter as any);
    const allParams = {
      ...queryString.parse(history.location.search),
      ...queryString.parse(filterParams.toString()),
    };
    history.push({ pathname: history.location.pathname, search: queryString.stringify(allParams) });
    const keyedFilter = { [key]: filter };
    dispatch(saveFilter({ ...originalSearchRedux, ...keyedFilter }));
  }, [history, filter, dispatch, key, originalSearchRedux]);

  return;
};
