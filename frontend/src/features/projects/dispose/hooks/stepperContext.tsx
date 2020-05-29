import React, { useState, createContext } from 'react';
import { IStatus } from '../slices/projectWorkflowSlice';

export const StepperContext = createContext({} as any);

// The Provider must be wrapping your app/page that will use UserContext
export const StepContextProvider = (props: { children?: any }) => {
  // Use State to keep the values. Initial values are obtained from UserContextProvider’s props.
  const [currentStatus, setCurrentStatus] = useState<IStatus>();
  // Make the context object (or array)
  const stepContext = { currentStatus, setCurrentStatus };
  // Pass the value in Provider and return
  return <StepperContext.Provider value={stepContext}>{props.children}</StepperContext.Provider>;
};

export const { Consumer: UserContextConsumer } = StepperContext;
