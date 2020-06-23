import * as React from 'react';
import styled from 'styled-components';
import { useFormikContext } from 'formik';
import { ReviewWorkflowStatus } from '../interfaces';
import GenericModal from 'components/common/GenericModal';
import { useState } from 'react';
import { DisplayError, Button } from 'components/common/form';

const FlexRight = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  margin: 0.5rem 0;
  text-align: right;
`;

/**
 * A component for ERP/SPL actions
 * @component
 */
export const ApprovalActions = ({
  submitStatusCode,
  setSubmitStatusCode,
}: {
  submitStatusCode: string | undefined;
  setSubmitStatusCode: Function;
}) => {
  const { values, submitForm, isSubmitting, setSubmitting } = useFormikContext<any>();
  const [cancel, setCancel] = useState(false);
  return (
    <>
      <FlexRight>
        <DisplayError field="status" />
      </FlexRight>
      <FlexRight>
        <span>
          <Button
            disabled={values.statusCode === ReviewWorkflowStatus.Cancelled || isSubmitting}
            style={{ marginLeft: 10 }}
            showSubmitting
            isSubmitting={isSubmitting}
            onClick={() => {
              setSubmitting(true);
              submitForm();
            }}
          >
            Save
          </Button>
        </span>
        <span>
          <Button
            disabled={values.statusCode === ReviewWorkflowStatus.Cancelled || isSubmitting}
            variant="danger"
            showSubmitting
            isSubmitting={isSubmitting}
            onClick={() => {
              setSubmitting(true);
              setCancel(true);
            }}
          >
            Cancel Project
          </Button>
          {cancel && (
            <GenericModal
              display={cancel}
              cancelButtonText="Do not Cancel Project"
              okButtonText="Cancel Project"
              handleOk={() => {
                setSubmitStatusCode(ReviewWorkflowStatus.Cancelled);
                submitForm();
                setCancel(false);
              }}
              handleCancel={() => setCancel(false)}
              title="Really Cancel Project?"
              message="Are you sure you want to cancel this project?"
            />
          )}
        </span>
      </FlexRight>
    </>
  );
};
