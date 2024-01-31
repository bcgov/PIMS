import React, { createContext, useEffect, useState } from 'react';

export interface IConfig {
  API_HOST: string;
  NODE_ENV: string;
}

export const ConfigContext = createContext<IConfig | undefined>({
  API_HOST: '',
  NODE_ENV: '',
});

const getConfig = (): IConfig => {
  return {
    API_HOST: '/api',
    NODE_ENV: import.meta.env.MODE,
  };
};

export const ConfigContextProvider: React.FC<React.PropsWithChildren> = (props) => {
  const [config, setConfig] = useState<IConfig>();
  useEffect(() => {
    if (!config) {
      setConfig(getConfig());
    }
  }, [config]);
  return <ConfigContext.Provider value={config}>{props.children}</ConfigContext.Provider>;
};
