import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';

interface Step {
  title: string;
  route: string;
}

interface StepperProps {
  steps: Step[];
  activeStep: number;
}

/**
 * A simple stepper component that displays all based stepper components in order.
 * the active step is controlled externally via activeStep param.
 * @param param0 StepperProps
 */
const Stepper = ({ steps, activeStep }: StepperProps) => {
  const history = useHistory();
  return (
    <div className="bs-stepper">
      <div className="bs-stepper-header">
        {steps.map((step, index) => (
          <Fragment key={`stepper-${index}`}>
            <div
              className={classNames('step', activeStep === index ? 'active' : null)}
              data-target={`stepper-${index}`}
            >
              <button className="step-trigger" onClick={() => history.push(step.route)}>
                <span className="bs-stepper-circle">{index + 1}</span>
                <span className="bs-stepper-label">{step.title}</span>
              </button>
            </div>
            <div className="line"></div>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
