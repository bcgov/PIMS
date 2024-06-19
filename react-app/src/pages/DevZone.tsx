/* eslint-disable no-console */
//Simple component testing area.
import { LookupContext } from '@/contexts/lookupContext';
import React, { useContext } from 'react';

const Dev = () => {
  const lookup = useContext(LookupContext);
  console.log(lookup);
  return <></>;
};

export default Dev;
