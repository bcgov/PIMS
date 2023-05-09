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
      // Delete cookie - will not work in localhost because domain of cookie is
      // .gov.bc.ca which differs from localhost.
      document.cookie = 'SMSESSION=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

      navigate(
        `${configuration.siteMinderLogoutUrl}?returl=${configuration.baseUrl}/login&retnow=1`,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};

export default Logout;
