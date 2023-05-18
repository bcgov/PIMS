import { createAction, createSlice } from '@reduxjs/toolkit';
import { IProjectTask } from 'features/projects/interfaces';

export const saveProjectWorkflowTasks = createAction<IProjectTask[]>('saveProjectWorkflowTasks');
export const clearProjectWorkflowTasks = createAction('clearProjectWorkflowTasks');
/**
 * Slice to handle storage of project disposal tasks.
 */
const ProjectWorkflowTasksSlice = createSlice({
  name: 'projectWorkflowTasks',
  initialState: [] as IProjectTask[],
  reducers: {},
  extraReducers: (builder: any) => {
    // note that redux-toolkit uses immer to prevent state from being mutated.
    builder.addCase(saveProjectWorkflowTasks, (state: any, action: any) => {
      return action.payload;
    });
    builder.addCase(clearProjectWorkflowTasks, () => {
      return [];
    });
  },
});

export default ProjectWorkflowTasksSlice;
