/* eslint-disable no-console */
//Simple component testing area.
import React from 'react';
import { Agency } from '@/hooks/api/useAgencyApi';

const Dev = () => {
  const agencies: Agency[] = [];
  return <div>{agencies.at(0).Id}</div>;
};

export default Dev;
