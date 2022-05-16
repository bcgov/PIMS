import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IProjectForm } from 'features/projects/disposals/interfaces';

export interface IProjectState {
  projectForm?: IProjectForm;
}

export const initialProjectState: IProjectState = {};

export const projectSlice = createSlice({
  name: 'disposal',
  initialState: initialProjectState,
  reducers: {
    storeProject(state: IProjectState, action: PayloadAction<IProjectForm | undefined>) {
      state.projectForm = action.payload;
    },
  },
});

export const { storeProject } = projectSlice.actions;
