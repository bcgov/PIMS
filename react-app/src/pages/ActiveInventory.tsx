import PropertyTable from '@/components/property/PropertyTable';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ActiveInventory = () => {
  const navigate = useNavigate();
  return (
    <PropertyTable
      rowClickHandler={(params) => {
        if (params.row.Type === 'Building') {
          navigate(`building/${params.row.Id}`);
        } else {
          navigate(`parcel/${params.row.Id}`);
        }
      }}
    />
  );
};

export default ActiveInventory;
