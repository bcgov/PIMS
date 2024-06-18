/* eslint-disable no-console */
//Simple component testing area.
import React from 'react';
import usePimsApi from '@/hooks/usePimsApi';
import useDataLoader from '@/hooks/useDataLoader';

const Dev = () => {
  const api = usePimsApi();
  const { data, loadOnce } = useDataLoader(api.lookup.getAll);
  loadOnce();
  console.log(data);
  return <></>;
};

export default Dev;
