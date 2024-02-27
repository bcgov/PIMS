/* eslint-disable no-console */
//Simple component testing area.
import React, { useState } from 'react';
import { Agency } from '@/hooks/api/useAgencyApi';
import { Button } from '@mui/material';

const Dev = () => {
  const agencies: Agency[] = [];
  const [error, setError] = useState(false);
  return error ? (
    <div>{agencies.at(0).Id}</div>
  ) : (
    <Button
      variant="contained"
      onClick={() => {
        setError(true);
      }}
    >
      Cause Rendering Error
    </Button>
  );
};

export default Dev;
