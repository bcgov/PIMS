import { useKeycloak } from '@bcgov/citz-imb-kc-react';
import { useMemo } from 'react';

export type FetchResponse = Response & { parsedBody?: Record<string, any> };
export type FetchType = (url: string, params?: RequestInit) => Promise<Response>;
export interface IFetch {
  get: (
    url: string,
    params?: Record<string, any>,
    requestInit?: RequestInit,
  ) => Promise<FetchResponse>;
  put: (url: string, body?: any) => Promise<FetchResponse>;
  patch: (url: string, body?: any) => Promise<FetchResponse>;
  del: (url: string, body?: any) => Promise<FetchResponse>;
  post: (url: string, body?: any) => Promise<FetchResponse>;
}

/**
 * useFetch - hook serving as a wrapper over the native fetch implementation of node.
 * You can use this pretty similarly to a certain popular library, the baseUrl can be set to avoid typing in the root path all the time,
 * the authorization header is automatically set, and the request and response bodies are automatically encoded/decoded into JSON.
 *
 * @param baseUrl
 * @returns
 */
const useFetch = (baseUrl?: string) => {
  const keycloak = useKeycloak();

  return useMemo(() => {
    const absoluteFetch = async (url: string, params?: RequestInit): Promise<FetchResponse> => {
      let response: Response;

      params = {
        headers: {
          Authorization: keycloak.getAuthorizationHeaderValue(),
          'Content-Type': 'application/json',
        },
        ...params,
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
        (response as FetchResponse).parsedBody = parsedBody;
        return response;
      } else {
        return response;
      }
    };
    const buildQueryParams = (params: Record<string, any>): string => {
      if (!params || !Object.entries(params).length) {
        return '';
      }
      const q = Object.entries(params)
        .map(([k, value]) => {
          return `${k}=${encodeURIComponent(value)}`;
        })
        .join('&');
      return `?${q}`;
    };
    const get = (url: string, params?: Record<string, any>, requestInit?: RequestInit) => {
      return absoluteFetch(url + buildQueryParams(params), {
        method: 'GET',
        ...requestInit,
      });
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
