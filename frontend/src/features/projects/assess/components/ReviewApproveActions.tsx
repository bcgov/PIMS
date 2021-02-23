import * as React from 'react';
import styled from 'styled-components';
import { useFormikContext } from 'formik';
import { ReviewWorkflowStatus, IProject, IProperty } from '../../common/interfaces';
import GenericModal from 'components/common/GenericModal';
import { useState, useEffect } from 'react';
import { Button } from 'components/common/form';
import { validateFormikWithCallback } from 'utils';
import { PropertyTypes } from 'constants/propertyTypes';
import { deletePotentialSubdivisionParcels } from 'features/projects/common';

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
  }, [setSubmitStatusCode, submitForm, submitStatusCode]);
  return (
    <>
      <FlexRight>
        {values.exemptionRequested
          ? 'Approve Enhanced Referral Process Exemption'
          : 'Approve for Enhanced Referral Process'}
      </FlexRight>
      <FlexRight>
        <Button
          showSubmitting
          isSubmitting={isSubmitting}
          disabled={
            values.statusCode === ReviewWorkflowStatus.Denied ||
            values.statusCode === ReviewWorkflowStatus.ApprovedForErp ||
            values.statusCode === ReviewWorkflowStatus.ApprovedForExemption ||
            isSubmitting
          }
          style={{ marginLeft: 10 }}
          onClick={() => validateFormikWithCallback(formikProps, () => setApproveERP(true))}
        >
          Approve
        </Button>
        <Button
          showSubmitting
          isSubmitting={isSubmitting}
          disabled={
            values.statusCode === ReviewWorkflowStatus.Denied ||
            values.statusCode === ReviewWorkflowStatus.ApprovedForErp ||
            values.statusCode === ReviewWorkflowStatus.ApprovedForExemption ||
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
        <Button
          showSubmitting
          isSubmitting={isSubmitting}
          disabled={
            values.statusCode === ReviewWorkflowStatus.ApprovedForErp ||
            values.statusCode === ReviewWorkflowStatus.ApprovedForExemption ||
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
            cancelButtonText="Close"
            okButtonText="Deny"
            handleOk={() => {
              setSubmitStatusCode(ReviewWorkflowStatus.Denied);
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
      {approveERP && (
        <GenericModal
          display={approveERP}
          cancelButtonText="Close"
          okButtonText="Approve"
          handleOk={() => {
            !values.exemptionRequested
              ? setSubmitStatusCode(ReviewWorkflowStatus.ApprovedForErp)
              : setSubmitStatusCode(ReviewWorkflowStatus.ApprovedForExemption);
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
