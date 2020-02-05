import * as ActionTypes from "constants/actionTypes";

export const success = (reducer:string, data?:any) => ({
  name: reducer,
  type: ActionTypes.SUCCESS,
  data,
});

export const request = (reducer:string) => ({
  name: reducer,
  type: ActionTypes.REQUEST,
});

export const error = (reducer:string, err?:any) => ({
  name: reducer,
  type: ActionTypes.ERROR,
  errorMessage: err,
});

export const clear = (reducer:string) => ({
  name: reducer,
  type: ActionTypes.CLEAR,
});
