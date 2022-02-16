import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILookupCode } from 'actions/ILookupCode';

export const storeLookupCodes = createAction<ILookupCode[]>('storeLookupCodes');

export interface ILookupCodeState {
  lookupCodes: ILookupCode[];
}

export const initialLookupCodeState: ILookupCodeState = {
  lookupCodes: [],
};

export const lookupCodeSlice = createSlice({
  name: 'lookupCode',
  initialState: initialLookupCodeState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      storeLookupCodes,
      (state: ILookupCodeState, action: PayloadAction<ILookupCode[]>) => {
        return { ...state, lookupCodes: action.payload };
      },
    );
  },
});

export default lookupCodeSlice;
