import * as React from 'react';
import styled from 'styled-components';
import { useFormikContext } from 'formik';
import { ReviewWorkflowStatus } from '../interfaces';
import GenericModal from 'components/common/GenericModal';
import { useState, useEffect } from 'react';
import { DisplayError, Button } from 'components/common/form';
import { cancellationWarning } from '../strings';
import { useStepForm } from '..';

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
  const { values, submitForm, validateForm } = useFormikContext<any>();
  const [cancel, setCancel] = useState(false);
  const { noFetchingProjectRequests } = useStepForm();
  useEffect(() => {
    if (submitStatusCode !== undefined) {
      submitForm().then(() => setSubmitStatusCode(undefined));
    }
  }, [setSubmitStatusCode, submitForm, submitStatusCode]);
  return (
    <>
      <FlexRight>
        <DisplayError field="status" />
      </FlexRight>
      <FlexRight>
        <span>
          <Button
            disabled={
              values.statusCode === ReviewWorkflowStatus.Cancelled || !noFetchingProjectRequests
            }
            style={{ marginLeft: 10 }}
            showSubmitting
            isSubmitting={!noFetchingProjectRequests}
            onClick={() => {
              submitForm();
            }}
          >
            Save
          </Button>
        </span>
        <span>
          <Button
            disabled={
              values.statusCode === ReviewWorkflowStatus.Cancelled || !noFetchingProjectRequests
            }
            variant="danger"
            showSubmitting
            isSubmitting={!noFetchingProjectRequests}
            onClick={() => {
              validateForm().then((errors: any) => {
                if (Object.keys(errors).length === 0) {
                  setCancel(true);
                }
              });
            }}
          >
            Cancel Project
          </Button>
          {cancel && (
            <GenericModal
              display={cancel}
              cancelButtonText="Close"
              okButtonText="Cancel Project"
              handleOk={() => {
                setSubmitStatusCode(ReviewWorkflowStatus.Cancelled);
                setCancel(false);
              }}
              handleCancel={() => {
                setCancel(false);
              }}
              title="Really Cancel Project?"
              message={cancellationWarning}
            />
          )}
        </span>
      </FlexRight>
    </>
  );
};
