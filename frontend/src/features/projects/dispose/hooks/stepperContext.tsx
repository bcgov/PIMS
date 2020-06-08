import React, { useState, createContext, useEffect } from 'react';
import { IStatus } from '../slices/projectWorkflowSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectTasks } from '../projectsActionCreator';
import { RootState } from 'reducers/rootReducer';
import { IProjectWrapper, initialValues } from '..';

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
  //Load required redux context
  const project: any =
    useSelector<RootState, IProjectWrapper>(state => state.project).project || initialValues;
  useEffect(() => {
    dispatch(fetchProjectTasks(project.statusId));
  }, [dispatch, project.statusId]);

  // Pass the value in Provider and return
  return <StepperContext.Provider value={stepContext}>{props.children}</StepperContext.Provider>;
};

export const { Consumer: StepContextConsumer } = StepperContext;
