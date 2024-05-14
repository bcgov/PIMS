/* eslint-disable no-console */
//Simple component testing area.
import ParcelMap from '@/components/map/ParcelMap';
import React from 'react';

const Dev = () => {
  return <ParcelMap height="100%" loadProperties={true} popupSize="large" scrollOnClick />;
};

export default Dev;
