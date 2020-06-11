import * as React from 'react';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import { useFormikContext } from 'formik';
import { ReviewWorkflowStatus } from '../interfaces';

const FlexRight = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  margin: 0.5rem 0;
`;

interface IReviewApproveActionsProps {
  //onSave: () => void; TODO
  //onNext: () => void; TODO
}

/**
 * A component for project review actions
 * @component
 */
export const ReviewApproveActions: React.FC<IReviewApproveActionsProps> = () => {
  const { values, submitForm } = useFormikContext<any>();
  return (
    <>
      <FlexRight>Approve for Enhanced Referral Process</FlexRight>
      <FlexRight>
        <span>
          <Button
            style={{ marginLeft: 10 }}
            onClick={() => {
              values.statusId = ReviewWorkflowStatus.ApprovedForErp;
              submitForm();
            }}
          >
            Approve for ERP
          </Button>
          <Button
            variant="secondary"
            style={{ marginLeft: 10 }}
            onClick={() => {
              values.statusId = ReviewWorkflowStatus.PropertyReview;
              submitForm();
            }}
          >
            Save
          </Button>
        </span>
      </FlexRight>
      <FlexRight style={{ marginTop: '2rem' }}>Deny and Release Properties</FlexRight>
      <FlexRight>
        <span>
          <Button
            variant="danger"
            onClick={() => {
              values.statusId = ReviewWorkflowStatus.Denied;
              submitForm();
            }}
          >
            Deny
          </Button>
        </span>
      </FlexRight>
    </>
  );
};
