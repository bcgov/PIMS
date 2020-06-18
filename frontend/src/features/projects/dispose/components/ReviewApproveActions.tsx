import * as React from 'react';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import { useFormikContext } from 'formik';
import { ReviewWorkflowStatus } from '../interfaces';
import GenericModal from 'components/common/GenericModal';
import { useState } from 'react';

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
}: {
  submitStatusCode: string | undefined;
  setSubmitStatusCode: Function;
}) => {
  const { values, submitForm } = useFormikContext<any>();
  const [approveERP, setApproveERP] = useState(false);
  const [denyERP, setDenyERP] = useState(false);
  return (
    <>
      <FlexRight>Approve for Enhanced Referral Process</FlexRight>
      <FlexRight>
        <span>
          <Button
            disabled={
              values.statusCode === ReviewWorkflowStatus.Denied ||
              values.statusCode === ReviewWorkflowStatus.ApprovedForErp
            }
            style={{ marginLeft: 10 }}
            onClick={() => {
              setApproveERP(true);
            }}
          >
            Approve
          </Button>
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
          <Button
            disabled={values.statusCode === ReviewWorkflowStatus.Denied}
            variant="secondary"
            style={{ marginLeft: 10 }}
            onClick={() => {
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
            disabled={
              values.statusCode === ReviewWorkflowStatus.ApprovedForErp ||
              values.statusCode === ReviewWorkflowStatus.Denied
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
        </span>
      </FlexRight>
    </>
  );
};
