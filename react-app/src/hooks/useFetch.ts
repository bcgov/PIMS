import { useMemo } from 'react';

export type FetchType = (url: string, params?: RequestInit) => Promise<Response>;

const useFetch = (baseUrl?: string) => {
  return useMemo(() => {
    const absoluteFetch = (url: string, params?: RequestInit) => {
      if (url.startsWith('/')) return fetch(baseUrl + url, params);
      else return fetch(url, params);
    };
    const buildQueryParms = (params: Record<string, any>) => {
      const q = Object.entries(params)
        .map(([k, value]) => {
          return `${k}=${encodeURIComponent(value)}`;
        })
        .join('&');
      return `?${q}`;
    };
    const fetchGet = (url: string, params: Record<string, any>) => {
      return absoluteFetch(url + buildQueryParms(params), { method: 'GET' });
    };
    return {
      fetchGet,
    };
  }, [baseUrl]);
};

export default useFetch;
