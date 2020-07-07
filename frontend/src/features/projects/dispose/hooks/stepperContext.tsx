import React, { useState, createContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import {
  IProjectWrapper,
  initialValues,
  IStatus,
  fetchProjectTasks,
  fetchProjectWorkflow,
} from '../../common';

export const StepperContext = createContext({} as any);

/**
 * React Context that tracks the user's current status/step within the dispose workflow.
 * @param props
 */
export const StepContextProvider = (props: { children?: any }) => {
  // Use State to keep the values. Initial values are obtained from StepperContextProvider’s props.
  const [currentStatus, setCurrentStatus] = useState<IStatus>();
  // Make the context object (or array)
  const stepContext = { currentStatus, setCurrentStatus };
  const dispatch = useDispatch();
  const workflowStatuses = useSelector<RootState, IStatus[]>(state => state.projectWorkflow as any);
  //Load required redux context
  const project: any =
    useSelector<RootState, IProjectWrapper>(state => state.project).project || initialValues;
  useEffect(() => {
    if (project.statusId > 0) {
      dispatch(fetchProjectTasks(project.statusId));
    }
  }, [dispatch, project.statusId]);

  const workflowStatusesLength = workflowStatuses?.length;
  useEffect(() => {
    if (!workflowStatusesLength) {
      dispatch(fetchProjectWorkflow(project.workflowStatusCode));
    }
  }, [dispatch, project.statusId, project.workflowStatusCode, workflowStatusesLength]);

  // Pass the value in Provider and return
  return <StepperContext.Provider value={stepContext}>{props.children}</StepperContext.Provider>;
};

export const { Consumer: StepContextConsumer } = StepperContext;
