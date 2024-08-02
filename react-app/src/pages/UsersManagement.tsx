import UsersTable from '@/components/users/UsersTable';
import useDataLoader from '@/hooks/useDataLoader';
import useHistoryAwareNavigate from '@/hooks/useHistoryAwareNavigate';
import usePimsApi from '@/hooks/usePimsApi';
import React from 'react';

const UsersManagement = () => {
  const { navigateAndSetFrom } = useHistoryAwareNavigate();
  // Getting data from API
  const usersApi = usePimsApi();
  const { data, refreshData, isLoading, error } = useDataLoader(usersApi.users.getAllUsers);

  return (
    <UsersTable
      rowClickHandler={(params) => {
        // Checking length of selection so it only navigates if user isn't trying to select something
        const selection = window.getSelection().toString();
        if (!selection.length) {
          navigateAndSetFrom(`/users/${params.id}`);
        }
      }}
      data={data}
      refreshData={() => refreshData({})}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default UsersManagement;
