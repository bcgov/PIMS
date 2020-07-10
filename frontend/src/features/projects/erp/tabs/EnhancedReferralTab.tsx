import * as React from 'react';
import { ReviewWorkflowStatus } from '../../common';
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

  if ((values as any).statusCode === ReviewWorkflowStatus.ApprovedForExemption) {
    return (
      <ExemptionEnhancedReferralCompleteForm
        isReadOnly={isReadOnly}
        onClickProceedToSpl={() => setSubmitStatusCode(ReviewWorkflowStatus.ApprovedForSpl)}
        onClickNotInSpl={() => setSubmitStatusCode(ReviewWorkflowStatus.NotInSpl)}
        onClickGreTransferred={() => goToGreTransferred()}
        onClickAddToErp={() => setSubmitStatusCode(ReviewWorkflowStatus.ApprovedForErp)}
      />
    );
  }

  return (
    <>
      <AgencyResponseForm isReadOnly={isReadOnly} />
      <EnhancedReferralCompleteForm
        isReadOnly={isReadOnly}
        onClickOnHold={() => {
          setSubmitStatusCode(ReviewWorkflowStatus.OnHold);
        }}
        onClickProceedToSpl={() => setSubmitStatusCode(ReviewWorkflowStatus.ApprovedForSpl)}
        onClickNotInSpl={() => setSubmitStatusCode(ReviewWorkflowStatus.NotInSpl)}
        onClickGreTransferred={() => goToGreTransferred()}
      />
    </>
  );
};

export default EnhancedReferralTab;
