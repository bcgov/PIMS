import React, { useState, createContext } from 'react';
import { IStatus } from '../slices/projectWorkflowSlice';

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
  // Pass the value in Provider and return
  return <StepperContext.Provider value={stepContext}>{props.children}</StepperContext.Provider>;
};

export const { Consumer: StepContextConsumer } = StepperContext;
