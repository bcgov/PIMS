import React, { Fragment } from 'react';
import classNames from 'classnames';
import { FaCheck } from 'react-icons/fa';
import './Stepper.scss';
import { ObjectSchema } from 'yup';

export interface IStep {
  title: string;
  route: string;
  completed: boolean;
  canGoToStep: boolean;
  validation?: {
    schema: ObjectSchema<object>;
    nameSpace: (currentTab: number) => string;
  };
}

interface StepperProps {
  steps: IStep[];
  activeStep: number;
  activeStepMessage?: string;
  onChange: (step: IStep, index?: number) => void;
}

/**
 * A simple stepper component that displays all based stepper components in order.
 * the active step is controlled externally via activeStep param.
 * @param StepperProps
 */
const Stepper = ({ steps, activeStep, activeStepMessage, onChange }: StepperProps) => {
  return (
    <div className="bs-stepper">
      {!!activeStepMessage && <h6>{activeStepMessage}</h6>}
      <div className="bs-stepper-header">
        {steps.map((step, index) => (
          <Fragment key={`stepper-${index}`}>
            <div
              className={classNames('step', activeStep === index ? 'active' : null)}
              data-target={`stepper-${index}`}
            >
              <button
                type="button"
                className="step-trigger"
                disabled={!step.canGoToStep}
                onClick={() => onChange(step, index)}
              >
                <span
                  className={classNames(step.completed ? 'completed' : null, 'bs-stepper-circle')}
                >
                  {step.completed ? <FaCheck /> : index + 1}
                </span>
                <span className="bs-stepper-label">{step.title}</span>
              </button>
            </div>
            {index < steps.length - 1 && <div className="line"></div>}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
