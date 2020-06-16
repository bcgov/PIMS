import * as React from 'react';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import Claims from 'constants/claims';

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
  getNextStep?: Function;
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
  getNextStep,
}) => {
  const step = getNextStep && getNextStep();
  const nextLabel = step !== undefined ? 'Next' : 'Submit';
  const { hasClaim } = useKeycloakWrapper();
  const missingDisposeMilestonePermission =
    !hasClaim(Claims.DISPOSE_REQUEST) && (step?.isMilestone || step === undefined);
  return (
    <StepActionsWrapper>
      <Button
        disabled={nextDisabled || missingDisposeMilestonePermission}
        style={{ marginLeft: 10 }}
        onClick={onNext}
        variant={nextLabel === 'Submit' ? 'warning' : 'primary'}
      >
        {nextLabel}
      </Button>
      <Button
        variant="secondary"
        disabled={saveDisabled || missingDisposeMilestonePermission}
        onClick={onSave}
      >
        Save
      </Button>
    </StepActionsWrapper>
  );
};
