import AgencyTable from '@/components/agencies/AgencyTable';
import React from 'react';
import useHistoryAwareNavigate from '@/hooks/useHistoryAwareNavigate';

const AgencyManagement = () => {
  const { navigateAndSetFrom } = useHistoryAwareNavigate();
  return (
    <AgencyTable
      rowClickHandler={(params) => {
        // Checking length of selection so it only navigates if user isn't trying to select something
        const selection = window.getSelection().toString();
        if (!selection.length) {
          navigateAndSetFrom(`/admin/agencies/${params.id}`);
        }
      }}
    />
  );
};

export default AgencyManagement;
