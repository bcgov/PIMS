import { useKeycloak } from '@bcgov/citz-imb-kc-react';
import { useMemo } from 'react';

export type FetchResponse = Response & { parsedBody?: Record<string, any> };
export type FetchType = (url: string, params?: RequestInit) => Promise<Response>;
export interface IFetch {
  get: (url: string, params?: Record<string, any>) => Promise<FetchResponse>;
  put: (url: string, body?: any) => Promise<FetchResponse>;
  patch: (url: string, body?: any) => Promise<FetchResponse>;
  del: (url: string, body?: any) => Promise<FetchResponse>;
  post: (url: string, body?: any) => Promise<FetchResponse>;
}
const useFetch = (baseUrl?: string) => {
  const keycloak = useKeycloak();

  return useMemo(() => {
    const absoluteFetch = async (url: string, params?: RequestInit): Promise<FetchResponse> => {
      let response: Response;

      params = {
        ...params,
        headers: {
          Authorization: keycloak.getAuthorizationHeaderValue(),
        },
      };

      if (params && params.body) {
        params.body = JSON.stringify(params.body);
      }

      if (url.startsWith('/')) {
        response = await fetch(baseUrl + url, params);
      } else {
        response = await fetch(url, params);
      }
      const text = await response.text();
      if (text.length) {
        let parsedBody: any | undefined;
        try {
          parsedBody = JSON.parse(text);
        } catch {
          parsedBody = text;
        }
        return { ...response, parsedBody: parsedBody };
      } else {
        return response;
      }
    };
    const buildQueryParms = (params: Record<string, any>): string => {
      if (!params) {
        return '';
      }
      const q = Object.entries(params)
        .map(([k, value]) => {
          return `${k}=${encodeURIComponent(value)}`;
        })
        .join('&');
      return `?${q}`;
    };
    const get = (url: string, params?: Record<string, any>) => {
      return absoluteFetch(url + buildQueryParms(params), { method: 'GET' });
    };
    const post = (url: string, body: any) => {
      return absoluteFetch(url, { method: 'POST', body: body });
    };
    const put = (url: string, body: any) => {
      return absoluteFetch(url, { method: 'PUT', body: body });
    };
    const patch = (url: string, body: any) => {
      return absoluteFetch(url, { method: 'PATCH', body: body });
    };
    const del = (url: string, body: any) => {
      return absoluteFetch(url, { method: 'DELETE', body: body });
    };
    return {
      get,
      patch,
      put,
      post,
      del,
    };
  }, [baseUrl, keycloak]);
};

export default useFetch;
