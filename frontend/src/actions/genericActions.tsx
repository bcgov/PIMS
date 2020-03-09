import * as ActionTypes from 'constants/actionTypes';

export interface IGenericNetworkAction {
  isFetching: boolean;
  name: string;
  type: string;
  errorMessage?: string;
  status?: number;
  data?: any;
}

export const success = (reducer: string, status?: number, data?: any): IGenericNetworkAction => ({
  isFetching: false,
  name: reducer,
  type: ActionTypes.SUCCESS,
  status,
  data,
});

export const request = (reducer: string): IGenericNetworkAction => ({
  isFetching: true,
  name: reducer,
  type: ActionTypes.REQUEST,
});

export const error = (reducer: string, status?: number, err?: any): IGenericNetworkAction => ({
  isFetching: false,
  name: reducer,
  type: ActionTypes.ERROR,
  errorMessage: err,
  status,
});

export const clear = (reducer: string): IGenericNetworkAction => ({
  isFetching: false,
  name: reducer,
  type: ActionTypes.CLEAR,
});
