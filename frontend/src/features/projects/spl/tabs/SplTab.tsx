import * as React from 'react';
import { SurplusPropertyListForm } from '..';
import { ReviewWorkflowStatus } from 'features/projects/common';

interface ISplTabProps {
  isReadOnly?: boolean;
  setSubmitStatusCode: Function;
  goToGreTransferred: Function;
}

/**
 * Enhanced Referral tab used to display project details for the ERP process.
 * @param param0 ISplTabProps
 */
export const SplTab: React.FunctionComponent<ISplTabProps> = ({
  isReadOnly,
  setSubmitStatusCode,
  goToGreTransferred,
}: ISplTabProps) => {
  return (
    <SurplusPropertyListForm
      isReadOnly={isReadOnly}
      onClickProceedToSPL={() => setSubmitStatusCode(ReviewWorkflowStatus.ApprovedForSpl)}
      onClickRemoveFromSPL={() => setSubmitStatusCode(ReviewWorkflowStatus.NotInSpl)}
      onClickPreMarketing={() => setSubmitStatusCode(ReviewWorkflowStatus.PreMarketing)}
      onClickMarketedOn={() => setSubmitStatusCode(ReviewWorkflowStatus.OnMarket)}
      onClickContractInPlaceConditional={() =>
        setSubmitStatusCode(ReviewWorkflowStatus.ContractInPlaceConditional)
      }
      onClickContractInPlaceUnconditional={() =>
        setSubmitStatusCode(ReviewWorkflowStatus.ContractInPlaceUnconditional)
      }
      onClickDisposedExternally={() => setSubmitStatusCode(ReviewWorkflowStatus.Disposed)}
      onClickGreTransferred={() => goToGreTransferred()}
    />
  );
};

export default SplTab;
