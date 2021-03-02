import * as React from 'react';
import styled from 'styled-components';
import { useFormikContext } from 'formik';
import { ReviewWorkflowStatus } from '../../common/interfaces';
import GenericModal from 'components/common/GenericModal';
import { useState, useEffect } from 'react';
import { DisplayError, Button } from 'components/common/form';
import {
  useStepForm,
  cancellationWarning,
  IProperty,
  deletePotentialSubdivisionParcels,
} from '../../common';
import { PropertyTypes } from 'constants/index';

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
  submitDirectly,
  disableCancel,
}: {
  submitStatusCode: string | undefined;
  setSubmitStatusCode: Function;
  submitDirectly?: Function;
  disableCancel?: boolean;
}) => {
  const { values, submitForm } = useFormikContext<any>();
  const [cancel, setCancel] = useState(false);
  const { noFetchingProjectRequests } = useStepForm();
  const hasSubdivisions = (values.properties ?? []).some(
    (property: IProperty) => property.propertyTypeId === PropertyTypes.SUBDIVISION,
  );
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
              (submitDirectly ?? submitForm)();
            }}
          >
            Save
          </Button>
        </span>
        <span>
          <Button
            disabled={
              values.statusCode === ReviewWorkflowStatus.Cancelled ||
              !noFetchingProjectRequests ||
              disableCancel
            }
            variant="danger"
            showSubmitting
            isSubmitting={!noFetchingProjectRequests}
            onClick={() => {
              setCancel(true);
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
              message={
                <>
                  <p>{cancellationWarning}</p>
                  {hasSubdivisions && (
                    <>
                      <hr className="mb-3"></hr>
                      <p>{deletePotentialSubdivisionParcels}</p>
                    </>
                  )}
                </>
              }
            />
          )}
        </span>
      </FlexRight>
    </>
  );
};
