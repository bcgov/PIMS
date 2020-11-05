import * as React from 'react';
import styled from 'styled-components';
import { Button, Spinner } from 'react-bootstrap';
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
  isFetching?: boolean;
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
  isFetching,
}) => {
  const step = getNextStep && getNextStep();
  const nextLabel = step !== undefined ? 'Next' : 'Submit';
  const { hasClaim } = useKeycloakWrapper();
  const missingDisposeMilestonePermission =
    !hasClaim(Claims.DISPOSE_REQUEST) && (step?.isMilestone || step === undefined);
  return (
    <StepActionsWrapper>
      <Button
        disabled={nextDisabled || missingDisposeMilestonePermission || isFetching}
        style={{ marginLeft: 10 }}
        onClick={onNext}
        variant={nextLabel === 'Submit' || nextLabel === 'Next' ? 'primary' : 'secondary'}
      >
        {nextLabel}
        {isFetching && (
          <Spinner
            animation="border"
            size="sm"
            role="status"
            as="span"
            style={{ marginLeft: '.5rem' }}
          />
        )}
      </Button>
      <Button
        variant="secondary"
        disabled={saveDisabled || missingDisposeMilestonePermission || isFetching}
        onClick={onSave}
      >
        Save
        {isFetching && (
          <Spinner
            animation="border"
            size="sm"
            role="status"
            as="span"
            style={{ marginLeft: '.5rem' }}
          />
        )}
      </Button>
    </StepActionsWrapper>
  );
};
