import * as React from 'react';
import { EnhancedReferralCompleteForm, AgencyResponseForm } from '..';

interface IEnhancedReferralTabProps {
  isReadOnly?: boolean;
}

/**
 * Enhanced Referral tab used to display project details for the ERP process.
 * @param param0 IEnhancedReferralTabProps
 */
const EnhancedReferralTab: React.FunctionComponent<IEnhancedReferralTabProps> = ({
  isReadOnly,
}: IEnhancedReferralTabProps) => {
  return (
    <>
      <AgencyResponseForm isReadOnly={isReadOnly} />
      <EnhancedReferralCompleteForm isReadOnly={isReadOnly} />
    </>
  );
};

export default EnhancedReferralTab;
