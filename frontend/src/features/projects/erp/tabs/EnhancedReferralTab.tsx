import * as React from 'react';
import { ReviewWorkflowStatus, useProject, useStepForm } from '../../common';
import { EnhancedReferralCompleteForm, AgencyResponseForm } from '..';
import { useFormikContext } from 'formik';
import ExemptionEnhancedReferralCompleteForm from '../forms/ExemptionEnhancedReferralCompleteForm';

interface IEnhancedReferralTabProps {
  isReadOnly?: boolean;
  setSubmitStatusCode: Function;
  goToGreTransferred: Function;
}

/**
 * Enhanced Referral tab used to display project details for the ERP process.
 * @param param0 IEnhancedReferralTabProps
 */
const EnhancedReferralTab: React.FunctionComponent<IEnhancedReferralTabProps> = ({
  isReadOnly,
  setSubmitStatusCode,
  goToGreTransferred,
}: IEnhancedReferralTabProps) => {
  const { values } = useFormikContext();

  const { project } = useProject();
  const { canUserApproveForm, canUserOverride } = useStepForm();
  const canUserEdit =
    !isReadOnly ||
    canUserOverride() ||
    (canUserApproveForm() &&
      (project?.statusCode === ReviewWorkflowStatus.ApprovedForErp ||
        project?.statusCode === ReviewWorkflowStatus.ERP ||
        project?.statusCode === ReviewWorkflowStatus.OnHold ||
        project?.statusCode === ReviewWorkflowStatus.ApprovedForExemption ||
        project?.statusCode === ReviewWorkflowStatus.NotInSpl));

  if ((values as any).exemptionRequested) {
    return (
      <ExemptionEnhancedReferralCompleteForm
        isReadOnly={!canUserEdit}
        onClickProceedToSpl={() => setSubmitStatusCode(ReviewWorkflowStatus.ApprovedForSpl)}
        onClickNotInSpl={() => setSubmitStatusCode(ReviewWorkflowStatus.NotInSpl)}
        onClickGreTransferred={() => goToGreTransferred()}
        onClickAddToErp={() => setSubmitStatusCode(ReviewWorkflowStatus.ApprovedForErp)}
        onClickDisposedExternally={() => setSubmitStatusCode(ReviewWorkflowStatus.Disposed)}
      />
    );
  }

  return (
    <>
      <AgencyResponseForm isReadOnly={!canUserEdit} />
      <EnhancedReferralCompleteForm
        isReadOnly={!canUserEdit}
        onClickOnHold={() => {
          setSubmitStatusCode(ReviewWorkflowStatus.OnHold);
        }}
        onClickProceedToSpl={() => setSubmitStatusCode(ReviewWorkflowStatus.ApprovedForSpl)}
        onClickNotInSpl={() => setSubmitStatusCode(ReviewWorkflowStatus.NotInSpl)}
        onClickDisposedExternally={() => setSubmitStatusCode(ReviewWorkflowStatus.Disposed)}
        onClickGreTransferred={() => goToGreTransferred()}
      />
    </>
  );
};

export default EnhancedReferralTab;
