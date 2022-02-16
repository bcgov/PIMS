import React from 'react';

export interface IEnvironment {
  env: string;
}

/**
 * Fetch the config map environment.json file.
 *
 * @returns Environment variables.
 */
export const useEnvironment = () => {
  const [env, setEnv] = React.useState({ env: 'production' });

  React.useEffect(() => {
    const call = async () => {
      var response = await fetch('/environment.json');
      var data = await response.json();
      return data;
    };

    call()
      .then((data) => {
        // Update state with the file data.
        setEnv(data);
      })
      .catch((error) => {
        // File doesn't exist, assume development.
        setEnv({ env: 'development' });
      });
  }, [setEnv]);

  return env;
};
