import * as React from 'react';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import useStepper from './hooks/useStepper';

const StepActionsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
`;

interface IStepActionsProps {
  onSave: () => void;
  onNext: () => void;
  saveDisabled?: boolean;
  nextDisabled?: boolean;
}

/**
 * A component for project disposal step actions
 * @component
 * @example
 * const api = useApi();
 * const step = useStepper();
 * const save = (data) => api.post('/project/disposal', data);
 * const onSave = () => save(data);
 * const onNext = () =>  save(data).then(() => step.next());
 * const saveDisabled = false;
 * const nextDisabled = false;
 * return (
 *  <StepActions onNext={onNext} onSave={onSave} nextDisabled={nextDisabled} saveDisabled={saveDisabled}/>
 * );
 */
export const StepActions: React.FC<IStepActionsProps> = ({
  onSave,
  onNext,
  nextDisabled,
  saveDisabled,
}) => {
  const { getNextStep } = useStepper();
  const nextLabel = getNextStep() ? 'Next' : 'Submit';
  return (
    <StepActionsWrapper>
      <Button disabled={nextDisabled} style={{ marginLeft: 10 }} onClick={onNext}>
        {nextLabel}
      </Button>
      <Button disabled={saveDisabled} onClick={onSave}>
        Save
      </Button>
    </StepActionsWrapper>
  );
};
