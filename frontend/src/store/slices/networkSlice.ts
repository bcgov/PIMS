import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import * as ActionTypes from 'constants/actionTypes';

export interface IGenericNetworkAction {
  isFetching: boolean;
  name: string;
  type: string;
  error?: AxiosError;
  status?: number;
  data?: any;
}

export interface INetworkState {
  requests: {};
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
          type: ActionTypes.CLEAR,
        },
      };
    },
  },
  extraReducers: builder => {},
});

export const { storeRequest, storeSuccess, storeError, clearRequest } = networkSlice.actions;
