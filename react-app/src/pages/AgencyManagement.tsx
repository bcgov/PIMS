import AgencyTable from '@/components/agencies/AgencyTable';
import { useNavigate } from 'react-router-dom';
import React from 'react';

const AgencyManagement = () => {
  const navigate = useNavigate();

  return (
    <AgencyTable
      rowClickHandler={(params) => {
        // Checking length of selection so it only navigates if user isn't trying to select something
        const selection = window.getSelection().toString();
        if (!selection.length) {
          navigate(`/admin/agencies/${params.id}`);
        }
      }}
    />
  );
};

export default AgencyManagement;
