import React from 'react';
import { Redirect } from 'react-router-dom';
import { useConfiguration } from 'hooks/useConfiguration';

export const LogoutPage = () => {
  const configuration = useConfiguration();

  React.useEffect(() => {
    if (configuration.siteMinderLogoutUrl) {
      window.location.replace(
        `${configuration.siteMinderLogoutUrl}?returl=${configuration.baseUrl}/login&retnow=1`,
      );
    }
  }, [configuration]);

  return !configuration.siteMinderLogoutUrl ? <Redirect to="/login" /> : null;
};
