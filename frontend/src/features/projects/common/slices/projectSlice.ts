import { toFlatProject } from '../projectConverter';
import { createSlice, createAction } from '@reduxjs/toolkit';
import { IProject, IApiProject } from '..';

export interface IProjectWrapper {
  project?: IProject;
}

export const saveProject = createAction<IProject>('saveProject');
export const clearProject = createAction('clearProject');

/**
 * Slice to handle storage of project worflow information for all project disposal steps.
 */
const projectSlice = createSlice({
  name: 'project',
  initialState: {},
  reducers: {},
  extraReducers: (builder: any) => {
    // note that redux-toolkit uses immer to prevent state from being mutated.
    builder.addCase(saveProject, (state: any, action: any) => {
      const project = action.payload as IApiProject;
      return { project: toFlatProject(project) };
    });
    builder.addCase(clearProject, () => {
      return {};
    });
  },
});

export default projectSlice;
