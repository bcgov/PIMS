/* eslint-disable no-console */
//Simple component testing area.
import AgencySearchTable from '@/components/projects/AgencyResponseSearchTable';
import React, { useState } from 'react';

const Dev = () => {
  const [rows, setRows] = useState([]);
  return <AgencySearchTable rows={rows} setRows={setRows} />;
};

export default Dev;
