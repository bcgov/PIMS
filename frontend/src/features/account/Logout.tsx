import { useConfiguration } from 'hooks/useConfiguration';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Logout = () => {
  const configuration = useConfiguration();
  const navigate = useNavigate();

  // On component mount
  useEffect(() => {
    if (!configuration.siteMinderLogoutUrl) {
      navigate('/login');
    } else {
      navigate(
        `${configuration.siteMinderLogoutUrl}?returl=${configuration.baseUrl}/login&retnow=1`,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};

export default Logout;
