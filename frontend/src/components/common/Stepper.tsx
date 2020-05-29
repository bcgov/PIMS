import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { FaCheck } from 'react-icons/fa';
import './Stepper.scss';

interface Step {
  title: string;
  route: string;
  completed: boolean;
  canGoToStep: boolean;
}

interface StepperProps {
  steps: Step[];
  activeStep: number;
  activeStepMessage?: string;
}

/**
 * A simple stepper component that displays all based stepper components in order.
 * the active step is controlled externally via activeStep param.
 * @param param0 StepperProps
 */
const Stepper = ({ steps, activeStep, activeStepMessage }: StepperProps) => {
  const history = useHistory();
  return (
    <div className="bs-stepper">
      <h6>{activeStepMessage}</h6>
      <div className="bs-stepper-header">
        {steps.map((step, index) => (
          <Fragment key={`stepper-${index}`}>
            <div
              className={classNames('step', activeStep === index ? 'active' : null)}
              data-target={`stepper-${index}`}
            >
              <button
                className="step-trigger"
                disabled={!step.canGoToStep}
                onClick={() => history.push(step.route)}
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
