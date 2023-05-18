import { IProjectForm } from 'features/projects/disposals/interfaces';
import React from 'react';
import { storeProject, useAppDispatch, useAppSelector } from 'store';

import { IProjectState } from '../projectSlice';

interface IProjectController {
  storeProject: (project?: IProjectForm) => void;
}

export const useProjectStore = (): [IProjectState, IProjectController] => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((store) => store.disposal);

  const controller = React.useMemo(
    () => ({
      storeProject: async (project?: IProjectForm) => {
        dispatch(storeProject(project));
      },
    }),
    [dispatch],
  );

  return [state, controller];
};
