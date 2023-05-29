import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';

export const saveAgencies = createAction<any>('saveProfile');
export const clearAgencies = createAction('clearProfile');
export const initialProfileState: number[] = [];

export const agenciesSlice = createSlice({
  name: 'usersAgencies',
  initialState: initialProfileState,
  reducers: {},
  extraReducers: (builder: any) => {
    builder.addCase(saveAgencies, (_state: any, action: PayloadAction<any>) => {
      return action.payload;
    });
    builder.addCase(clearAgencies, () => {
      return [];
    });
  },
});

export default agenciesSlice;
