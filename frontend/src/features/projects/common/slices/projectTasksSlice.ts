import { createAction, createSlice } from '@reduxjs/toolkit';
import { IProjectTask } from 'features/projects/interfaces';

export const saveProjectTasks = createAction<IProjectTask[]>('saveProjectTasks');
export const clearProjectTasks = createAction('clearProjectTasks');
/**
 * Slice to handle storage of project disposal tasks.
 */
const projectTasksSlice = createSlice({
  name: 'tasks',
  initialState: [] as IProjectTask[],
  reducers: {},
  extraReducers: (builder: any) => {
    // note that redux-toolkit uses immer to prevent state from being mutated.
    builder.addCase(saveProjectTasks, (state: any, action: any) => {
      return action.payload;
    });
    builder.addCase(clearProjectTasks, () => {
      return '';
    });
  },
});

export default projectTasksSlice;
