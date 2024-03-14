import UsersTable from '@/components/users/UsersTable';
import useDataLoader from '@/hooks/useDataLoader';
import usePimsApi from '@/hooks/usePimsApi';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const UsersManagement = () => {
  const navigate = useNavigate();
  // Getting data from API
  const usersApi = usePimsApi();
  const { data, refreshData, isLoading, error } = useDataLoader(usersApi.users.getAllUsers);

  return (
    <UsersTable
      rowClickHandler={(params) => navigate(`/admin/users/${params.id}`)}
      data={data}
      refreshData={refreshData}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default UsersManagement;
