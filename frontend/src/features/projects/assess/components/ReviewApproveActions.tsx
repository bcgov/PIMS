import { Button } from 'components/common/form';
import GenericModal from 'components/common/GenericModal';
import { PropertyTypes } from 'constants/propertyTypes';
import { deletePotentialSubdivisionParcels } from 'features/projects/common';
import { IProject, IProperty } from 'features/projects/interfaces';
import { useFormikContext } from 'formik';
import { WorkflowStatus } from 'hooks/api/projects';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { validateFormikWithCallback } from 'utils';

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
  submitDirectly,
}: {
  submitStatusCode: string | undefined;
  setSubmitStatusCode: Function;
  isSubmitting: boolean;
  submitDirectly?: Function;
}) => {
  const formikProps = useFormikContext<IProject>();
  const { values, submitForm } = formikProps;
  const [approveERP, setApproveERP] = useState(false);
  const [denyERP, setDenyERP] = useState(false);

  const hasSubdivisions = (values.properties ?? []).some(
    (property: IProperty) => property.propertyTypeId === PropertyTypes.SUBDIVISION,
  );
  useEffect(() => {
    if (submitStatusCode !== undefined) {
      submitForm().then(() => setSubmitStatusCode(undefined));
    }
  }, [submitForm, submitStatusCode]);
  return (
    <>
      <FlexRight>
        {values.exemptionRequested
          ? 'Approve Enhanced Referral Process Exemption'
          : 'Approve for Enhanced Referral Process'}
      </FlexRight>
      <FlexRight>
        {/**
         * APPROVE button: (1st button, in form).
         */}
        <Button
          data-testid="review-approve-action-approve-btn"
          showSubmitting
          isSubmitting={isSubmitting}
          disabled={
            values.statusCode === WorkflowStatus.Denied ||
            values.statusCode === WorkflowStatus.ApprovedForErp ||
            values.statusCode === WorkflowStatus.ApprovedForExemption ||
            isSubmitting
          }
          style={{ marginLeft: 10 }}
          onClick={() => validateFormikWithCallback(formikProps, () => setApproveERP(true))}
        >
          Approve
        </Button>
        {/**
         * SAVE button.
         */}
        <Button
          showSubmitting
          isSubmitting={isSubmitting}
          disabled={
            values.statusCode === WorkflowStatus.Denied ||
            values.statusCode === WorkflowStatus.ApprovedForErp ||
            values.statusCode === WorkflowStatus.ApprovedForExemption ||
            isSubmitting
          }
          variant="secondary"
          style={{ marginLeft: 10 }}
          onClick={() => {
            (submitDirectly ?? submitForm)(values);
          }}
        >
          Save
        </Button>
      </FlexRight>
      <FlexRight style={{ marginTop: '2rem' }}>Deny and Release Properties</FlexRight>
      <FlexRight>
        {/**
         * DENY button.
         */}
        <Button
          showSubmitting
          isSubmitting={isSubmitting}
          disabled={
            values.statusCode === WorkflowStatus.ApprovedForErp ||
            values.statusCode === WorkflowStatus.ApprovedForExemption ||
            values.statusCode === WorkflowStatus.Denied ||
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
            cancelButtonText="Close"
            okButtonText="Deny"
            handleOk={() => {
              setSubmitStatusCode(WorkflowStatus.Denied);
              setDenyERP(false);
            }}
            handleCancel={() => setDenyERP(false)}
            title="Deny Approval"
            message={
              <>
                {!values.exemptionRequested
                  ? `Are you sure you want to deny the project for Enhanced
                Referral Process? Please ensure to provide reasoning in the shared notes prior to
                clicking deny.`
                  : `Are you sure you want to deny this project with the request for
                exemption? Please ensure to provide reasoning in the shared notes prior to clicking
                deny.`}
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
      </FlexRight>
      {/**
       * APPROVE button: (2nd button, in modal). With notifications disabled.
       */}
      {approveERP && !values.sendNotifications && !values.exemptionRequested && (
        <GenericModal
          display={approveERP}
          cancelButtonText="Close"
          okButtonText="Approve"
          handleOk={() => {
            setSubmitStatusCode(WorkflowStatus.ApprovedForErp);
            setApproveERP(false);
          }}
          handleCancel={() => setApproveERP(false)}
          title="Confirm Approval"
          message={
            'Are you sure you want to approve the project for Enhanced Referral Process with notifications disabled?'
          }
        />
      )}
      {/**
       * APPROVE button: (2nd button, in modal).
       */}
      {((approveERP && values.sendNotifications) || (approveERP && values.exemptionRequested)) && (
        <GenericModal
          display={approveERP}
          cancelButtonText="Close"
          okButtonText="Approve"
          handleOk={() => {
            !values.exemptionRequested
              ? setSubmitStatusCode(WorkflowStatus.ApprovedForErp)
              : setSubmitStatusCode(WorkflowStatus.ApprovedForExemption);
            setApproveERP(false);
          }}
          handleCancel={() => setApproveERP(false)}
          title="Confirm Approval"
          message={
            values.exemptionRequested
              ? 'Are you sure you want to approve this ERP exemption'
              : 'Are you sure you want to approve the project for Enhanced Referral Process?'
          }
        />
      )}
    </>
  );
};
