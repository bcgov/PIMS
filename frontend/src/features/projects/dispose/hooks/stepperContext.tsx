import React, { useState, createContext, useEffect } from 'react';
import { useAppDispatch } from 'store';
import { fetchProjectWorkflow } from '../../common';
import { IStatus } from 'features/projects/interfaces';

export const StepperContext = createContext({} as any);

/**
 * React Context that tracks the user's current status/step within the dispose workflow.
 * @param props
 */
export const StepContextProvider = (props: { children?: any }) => {
  // Use State to keep the values. Initial values are obtained from StepperContextProvider’s props.
  const [currentStatus, setCurrentStatus] = useState<IStatus>();
  const [disposeWorkflowStatuses, setDisposeWorkflowStatuses] = useState<IStatus[]>();
  // Make the context object (or array)
  const stepContext = { currentStatus, setCurrentStatus, disposeWorkflowStatuses };
  const dispatch = useAppDispatch();
  useEffect(() => {
    fetchProjectWorkflow('SUBMIT-DISPOSAL')(dispatch).then((disposeWorkflowStatuses: IStatus[]) => {
      setDisposeWorkflowStatuses(disposeWorkflowStatuses);
    });
  }, [dispatch]);
  // Pass the value in Provider and return
  return <StepperContext.Provider value={stepContext}>{props.children}</StepperContext.Provider>;
};

export const { Consumer: StepContextConsumer } = StepperContext;
