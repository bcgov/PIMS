import * as React from 'react';
import { EnhancedReferralCompleteForm, AgencyResponseForm } from '..';
import { ReviewWorkflowStatus } from '../interfaces';
import { useFormikContext } from 'formik';

interface IEnhancedReferralTabProps {
  isReadOnly?: boolean;
  setSubmitStatusCode: Function;
}

/**
 * Enhanced Referral tab used to display project details for the ERP process.
 * @param param0 IEnhancedReferralTabProps
 */
const EnhancedReferralTab: React.FunctionComponent<IEnhancedReferralTabProps> = ({
  isReadOnly,
  setSubmitStatusCode,
}: IEnhancedReferralTabProps) => {
  const { submitForm } = useFormikContext();
  return (
    <>
      <AgencyResponseForm isReadOnly={isReadOnly} />
      <EnhancedReferralCompleteForm
        isReadOnly={isReadOnly}
        onClickOnHold={() => {
          setSubmitStatusCode(ReviewWorkflowStatus.OnHold);
          submitForm();
        }}
      />
    </>
  );
};

export default EnhancedReferralTab;
