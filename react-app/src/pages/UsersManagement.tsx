import UserDetail from '@/components/users/UserDetail';
import UsersTable from '@/components/users/UsersTable';
import React, { useState } from 'react';

const UsersManagement = () => {
  const [selectedUserId, setSelectedUserId] = useState('');

  return selectedUserId ? (
    <UserDetail userId={selectedUserId} onClose={() => setSelectedUserId('')} />
  ) : (
    <UsersTable rowClickHandler={(params) => setSelectedUserId(params.row.Id)} />
  );
};

export default UsersManagement;
