import * as ActionTypes from 'constants/actionTypes';
import React from 'react';
import { clearRequest, storeError, storeRequest, storeSuccess, useAppDispatch } from 'store';

interface INetworkController {
  storeRequest: (name: string) => void;
  storeSuccess: (name: string, status?: number, data?: any) => void;
  storeError: (name: string, status?: number, err?: any) => void;
  clearRequest: (name: string) => void;
}

export const useNetworkStore = (): INetworkController => {
  const dispatch = useAppDispatch();

  const controller = React.useMemo(
    () => ({
      storeRequest: async (name: string) => {
        dispatch(storeRequest(request(name)));
      },
      storeSuccess: async (name: string, status?: number, data?: any) => {
        dispatch(storeSuccess(success(name, status, data)));
      },
      storeError: async (name: string, status?: number, err?: any) => {
        dispatch(storeError(error(name, status, err)));
      },
      clearRequest: async (name: string) => {
        dispatch(clearRequest(clear(name)));
      },
    }),
    [dispatch],
  );

  return controller;
};

export const request = (name: string) => ({
  isFetching: true,
  name: name,
  type: ActionTypes.REQUEST,
  error: undefined,
  status: undefined,
  data: undefined,
});

export const success = (name: string, status?: number, data?: any) => ({
  isFetching: false,
  name: name,
  type: ActionTypes.SUCCESS,
  error: undefined,
  status,
  data,
});

export const error = (name: string, status?: number, err?: any) => ({
  isFetching: false,
  name: name,
  type: ActionTypes.ERROR,
  error: err,
  status,
  data: undefined,
});

export const clear = (name: string) => ({
  isFetching: false,
  name: name,
  type: ActionTypes.CLEAR,
  error: undefined,
  status: undefined,
  data: undefined,
});
