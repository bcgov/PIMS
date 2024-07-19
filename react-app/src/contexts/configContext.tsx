import React, { createContext, useEffect, useState } from 'react';

export interface IConfig {
  API_HOST: string;
  NODE_ENV: string;
  KEYCLOAK_CONFIG: Record<string, any>;
}

export const ConfigContext = createContext<IConfig | undefined>({
  API_HOST: '',
  NODE_ENV: '',
  KEYCLOAK_CONFIG: {},
});

const getConfig = (): IConfig => {
  return {
    API_HOST: '/api/v2',
    NODE_ENV: import.meta.env.MODE,
    KEYCLOAK_CONFIG: {
      authority: import.meta.env.VITE_SSO_AUTH_SERVER_URI,
      client_id: import.meta.env.VITE_SSO_CLIENT_ID,
      client_secret: import.meta.env.VITE_SSO_CLIENT_SECRET, //Need to add these in your .env
    },
  };
};

/**
 * Retrieves information from the environment and exposes it within this context.
 * @param props
 * @returns
 */
export const ConfigContextProvider: React.FC<React.PropsWithChildren> = (props) => {
  const [config, setConfig] = useState<IConfig>();
  useEffect(() => {
    if (!config) {
      setConfig(getConfig());
    }
  }, [config]);
  return <ConfigContext.Provider value={config}>{props.children}</ConfigContext.Provider>;
};
