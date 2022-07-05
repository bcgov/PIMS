import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiProject, IProject } from 'features/projects/interfaces';

import { toFlatProject } from '../projectConverter';

export const saveProject = createAction<IProject>('saveProject');
export const clearProject = createAction('clearProject');

export interface IProjectState {
  project?: IProject;
}

const initialState: IProjectState = {};

/**
 * Slice to handle storage of project worflow information for all project disposal steps.
 */
const projectSlice = createSlice({
  name: 'project',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder: any) => {
    // note that redux-toolkit uses immer to prevent state from being mutated.
    builder.addCase(saveProject, (_state: IProjectState, action: PayloadAction<IApiProject>) => {
      return { project: toFlatProject(action.payload) };
    });
    builder.addCase(clearProject, () => {
      return {};
    });
  },
});

export default projectSlice;
