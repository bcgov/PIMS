import * as ActionTypes from 'constants/actionTypes';
import { AxiosError } from 'axios';

export interface IGenericNetworkAction {
  isFetching: boolean;
  name: string;
  type: string;
  error?: AxiosError;
  status?: number;
  data?: any;
}

export const success = (reducer: string, status?: number, data?: any): IGenericNetworkAction => ({
  isFetching: false,
  name: reducer,
  type: ActionTypes.SUCCESS,
  error: undefined,
  status,
  data,
});

export const request = (reducer: string) => ({
  isFetching: true,
  name: reducer,
  type: ActionTypes.REQUEST,
  error: undefined,
  status: undefined,
  data: undefined,
});

export const error = (reducer: string, status?: number, err?: any): IGenericNetworkAction => ({
  isFetching: false,
  name: reducer,
  type: ActionTypes.ERROR,
  error: err,
  status,
  data: undefined,
});

export const clear = (reducer: string): IGenericNetworkAction => ({
  isFetching: false,
  name: reducer,
  type: ActionTypes.CLEAR,
  error: undefined,
  status: undefined,
  data: undefined,
});
