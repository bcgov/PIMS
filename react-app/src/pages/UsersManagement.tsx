import UserDetail from '@/components/users/UserDetail';
import UsersTable from '@/components/users/UsersTable';
import useDataLoader from '@/hooks/useDataLoader';
import usePimsApi from '@/hooks/usePimsApi';
import React, { useState } from 'react';

const UsersManagement = () => {
  const [selectedUserId, setSelectedUserId] = useState('');
  // Getting data from API
  const usersApi = usePimsApi();
  const { data, refreshData, isLoading, error } = useDataLoader(usersApi.users.getAllUsers);
  return selectedUserId ? (
    <UserDetail
      userId={selectedUserId}
      onClose={() => {
        setSelectedUserId('');
        refreshData();
      }}
    />
  ) : (
    <UsersTable
      rowClickHandler={(params) => setSelectedUserId(params.row.Id)}
      data={data}
      refreshData={refreshData}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default UsersManagement;
