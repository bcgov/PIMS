import PropertyTable from '@/components/property/PropertyTable';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ActiveInventory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <PropertyTable
      rowClickHandler={(params) => {
        if (params.row.PropertyType === 'Building') {
          navigate(`building/${params.row.Id}`, { state: { from: location } });
        } else {
          navigate(`parcel/${params.row.Id}`, { state: { from: location } });
        }
      }}
    />
  );
};

export default ActiveInventory;
