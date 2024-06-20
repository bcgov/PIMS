/* eslint-disable no-console */
//Simple component testing area.
import { LookupContext } from '@/contexts/lookupContext';
import React, { useContext } from 'react';

const Dev = () => {
  const { data, getLookupValueById } = useContext(LookupContext);
  console.log(data);
  if (getLookupValueById) {
    console.log(
      `Get AdministrativeArea with ID 1: ${JSON.stringify(getLookupValueById('AdministrativeAreas', 1))}`,
    );
    console.log(
      `Get RegionalDistrict with ID 19: ${JSON.stringify(getLookupValueById('RegionalDistricts', 19))}`,
    );
  }
  return <></>;
};

export default Dev;
