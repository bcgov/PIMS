import { createSlice, createAction, PayloadAction } from '@reduxjs/toolkit';
import * as ActionTypes from 'constants/actionTypes';
import { AxiosError } from 'axios';

export const storeRequest = createAction<IGenericNetworkAction>('REQUEST');
export const storeSuccess = createAction<IGenericNetworkAction>('SUCCESS');
export const storeError = createAction<IGenericNetworkAction>('ERROR');
export const storeClear = createAction<IGenericNetworkAction>('CLEAR');

export interface IGenericNetworkAction {
  isFetching: boolean;
  name: string;
  type: string;
  error?: AxiosError;
  status?: number;
  data?: any;
}

export const success = (reducer: string, status?: number, data?: any) =>
  storeSuccess({
    isFetching: false,
    name: reducer,
    type: ActionTypes.SUCCESS,
    error: undefined,
    status,
    data,
  });

export const request = (reducer: string) =>
  storeRequest({
    isFetching: true,
    name: reducer,
    type: ActionTypes.REQUEST,
    error: undefined,
    status: undefined,
    data: undefined,
  });

export const error = (reducer: string, status?: number, err?: any) =>
  storeError({
    isFetching: false,
    name: reducer,
    type: ActionTypes.ERROR,
    error: err,
    status,
    data: undefined,
  });

export const clear = (reducer: string) =>
  storeClear({
    isFetching: false,
    name: reducer,
    type: ActionTypes.CLEAR,
    error: undefined,
    status: undefined,
    data: undefined,
  });

const initialState = {};

export const networkSlice = createSlice({
  name: 'network',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(storeRequest, (state: {}, action: PayloadAction<IGenericNetworkAction>) => {
      return {
        ...state,
        [action.payload.name]: {
          name: action.payload.name,
          isFetching: true,
          status: undefined,
          error: undefined,
          type: action.payload.type,
        },
      };
    });
    builder.addCase(storeSuccess, (state: {}, action: PayloadAction<IGenericNetworkAction>) => {
      return {
        ...state,
        [action.payload.name]: {
          name: action.payload.name,
          isFetching: false,
          status: action.payload.status,
          error: undefined,
          type: action.payload.type,
        },
      };
    });
    builder.addCase(storeError, (state: {}, action: PayloadAction<IGenericNetworkAction>) => {
      return {
        ...state,
        [action.payload.name]: {
          name: action.payload.name,
          isFetching: false,
          status: action.payload.status,
          error: action.payload.error,
          type: action.type,
        },
      };
    });
    builder.addCase(storeClear, (state: {}, action: PayloadAction<IGenericNetworkAction>) => {
      return {
        ...state,
        [action.payload.name]: {
          name: action.payload.name,
          isFetching: false,
          status: undefined,
          error: undefined,
          type: undefined,
        },
      };
    });
  },
});

export default networkSlice;
