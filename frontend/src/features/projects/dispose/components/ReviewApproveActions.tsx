import * as React from 'react';
import styled from 'styled-components';
import { useFormikContext } from 'formik';
import { ReviewWorkflowStatus } from '../interfaces';
import GenericModal from 'components/common/GenericModal';
import { useState } from 'react';
import { Button } from 'components/common/form';

const FlexRight = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  margin: 0.5rem 0;
`;

/**
 * A component for project review actions
 * @component
 */
export const ReviewApproveActions = ({
  submitStatusCode,
  setSubmitStatusCode,
  isSubmitting,
}: {
  submitStatusCode: string | undefined;
  setSubmitStatusCode: Function;
  isSubmitting: boolean;
}) => {
  const { values, submitForm } = useFormikContext<any>();
  const [approveERP, setApproveERP] = useState(false);
  const [denyERP, setDenyERP] = useState(false);
  return (
    <>
      <FlexRight>Approve for Enhanced Referral Process</FlexRight>
      <FlexRight>
        <Button
          showSubmitting
          isSubmitting={isSubmitting}
          disabled={
            values.statusCode === ReviewWorkflowStatus.Denied ||
            values.statusCode === ReviewWorkflowStatus.ApprovedForErp ||
            isSubmitting
          }
          style={{ marginLeft: 10 }}
          onClick={() => {
            setApproveERP(true);
          }}
        >
          Approve
        </Button>
        <Button
          showSubmitting
          isSubmitting={isSubmitting}
          disabled={
            values.statusCode === ReviewWorkflowStatus.Denied ||
            values.statusCode === ReviewWorkflowStatus.ApprovedForErp ||
            isSubmitting
          }
          variant="secondary"
          style={{ marginLeft: 10 }}
          onClick={() => {
            submitForm();
          }}
        >
          Save
        </Button>
      </FlexRight>
      <FlexRight style={{ marginTop: '2rem' }}>Deny and Release Properties</FlexRight>
      <FlexRight>
        <Button
          showSubmitting
          isSubmitting={isSubmitting}
          disabled={
            values.statusCode === ReviewWorkflowStatus.ApprovedForErp ||
            values.statusCode === ReviewWorkflowStatus.Denied ||
            isSubmitting
          }
          variant="danger"
          onClick={() => {
            setDenyERP(true);
          }}
        >
          Deny
        </Button>
        {denyERP && (
          <GenericModal
            display={denyERP}
            cancelButtonText="Cancel"
            okButtonText="Deny"
            handleOk={() => {
              setSubmitStatusCode(ReviewWorkflowStatus.Denied);
              submitForm();
              setDenyERP(false);
            }}
            handleCancel={() => setDenyERP(false)}
            title="Deny Approval"
            message="Are you sure you want to deny this project for ERP?"
          />
        )}
      </FlexRight>
      {approveERP && (
        <GenericModal
          display={approveERP}
          cancelButtonText="Cancel"
          okButtonText="Confirm Approval"
          handleOk={() => {
            setSubmitStatusCode(ReviewWorkflowStatus.ApprovedForErp);
            submitForm();
            setApproveERP(false);
          }}
          handleCancel={() => setApproveERP(false)}
          title="Confirm Approval"
          message="Are you sure you want to approve this project for ERP?"
        />
      )}
    </>
  );
};
