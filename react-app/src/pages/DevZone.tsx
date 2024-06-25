/* eslint-disable no-console */
//Simple component testing area.
import useDataLoader from '@/hooks/useDataLoader';
import usePimsApi from '@/hooks/usePimsApi';
import React, { useEffect } from 'react';

const Dev = () => {
  const api = usePimsApi();
  const { data, refreshData } = useDataLoader(() =>
    api.bcAssessment.getBCAssessmentByLocation('-123.36905121803285', '48.41397415311252'),
  );
  useEffect(() => {
    refreshData();
  }, []);
  console.log(data);
  return <></>;
};

export default Dev;
