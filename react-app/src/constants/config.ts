export interface IConfig {
  API_HOST: string;
  NODE_ENV: string;
}

export const getConfig = (): IConfig => {
  return {
    API_HOST: '/api/v2',
    NODE_ENV: import.meta.env.MODE,
  };
};
