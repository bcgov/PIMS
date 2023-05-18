import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import * as ActionTypes from 'constants/actionTypes';

export interface IGenericNetworkAction {
  isFetching: boolean;
  name: string;
  type: string;
  error?: AxiosError<any>;
  status?: number;
  data?: any;
}

export interface INetworkState {
  requests: { [key: string]: IRequest };
}

export interface IRequest {
  data: any | undefined;
  error: any | undefined;
  isFetching: boolean;
  name: string;
  status: number | undefined;
  type: string;
}

export const initialNetworkState: INetworkState = {
  requests: {},
};

export const networkSlice = createSlice({
  name: 'network',
  initialState: initialNetworkState,
  reducers: {
    storeRequest(state: INetworkState, action: PayloadAction<IGenericNetworkAction>) {
      state.requests = {
        ...state.requests,
        [action.payload.name]: {
          name: action.payload.name,
          isFetching: true,
          status: undefined,
          error: undefined,
          data: undefined,
          type: ActionTypes.REQUEST,
        },
      };
    },
    storeSuccess(state: INetworkState, action: PayloadAction<IGenericNetworkAction>) {
      state.requests = {
        ...state.requests,
        [action.payload.name]: {
          name: action.payload.name,
          isFetching: false,
          status: action.payload.status,
          error: undefined,
          type: ActionTypes.SUCCESS,
          data: action.payload.data,
        },
      };
    },
    storeError(state: INetworkState, action: PayloadAction<IGenericNetworkAction>) {
      state.requests = {
        ...state.requests,
        [action.payload.name]: {
          name: action.payload.name,
          isFetching: false,
          status: action.payload.status,
          error: action.payload.error,
          data: undefined,
          type: ActionTypes.ERROR,
        },
      };
    },
    clearRequest(state: INetworkState, action: PayloadAction<IGenericNetworkAction>) {
      state.requests = {
        ...state.requests,
        [action.payload.name]: {
          name: action.payload.name,
          isFetching: false,
          status: undefined,
          error: undefined,
          data: undefined,
          type: ActionTypes.CLEAR,
        },
      };
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  extraReducers: (builder) => {},
});

export const { storeRequest, storeSuccess, storeError, clearRequest } = networkSlice.actions;
