import React from 'react';
import { ENVIRONMENT } from '../../constants/environment';

const PrettyPrintJson: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

const Debug: React.FC = () => {
  return (
    <div style={{ textAlign: 'left' }}>
      <h4>Env Config</h4>
      <PrettyPrintJson data={ENVIRONMENT} />
    </div>
  );
};

export default Debug;
