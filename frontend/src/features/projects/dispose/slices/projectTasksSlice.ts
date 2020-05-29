import { createSlice, createAction } from '@reduxjs/toolkit';

export interface ITask {
  id: number;
  name: string;
  sortOrder: number;
  description: string;
  taskType: number;
}
export const saveProjectTasks = createAction<ITask[]>('saveProjectTasks');
export const clearProjectTasks = createAction('clearProjectTasks');
/**
 * Slice to handle storage of project disposal tasks.
 */
const projectTasksSlice = createSlice({
  name: 'projectTasks',
  initialState: [] as ITask[],
  reducers: {},
  extraReducers: (builder: any) => {
    // note that redux-toolkit uses immer to prevent state from being mutated.
    builder.addCase(saveProjectTasks, (state: any, action: any) => {
      return action.payload;
    });
    builder.addCase(clearProjectTasks, (state: any) => {
      return '';
    });
  },
});

export default projectTasksSlice;
