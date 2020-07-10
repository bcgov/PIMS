import * as React from 'react';
import { SurplusPropertyListForm } from '..';
import { ReviewWorkflowStatus } from 'features/projects/common';

interface ISplTabProps {
  isReadOnly?: boolean;
  setSubmitStatusCode: Function;
}

/**
 * Enhanced Referral tab used to display project details for the ERP process.
 * @param param0 ISplTabProps
 */
const SplTab: React.FunctionComponent<ISplTabProps> = ({
  isReadOnly,
  setSubmitStatusCode,
}: ISplTabProps) => {
  return (
    <>
      <SurplusPropertyListForm
        isReadOnly={isReadOnly}
        onClickMarketedOn={() => setSubmitStatusCode(ReviewWorkflowStatus.OnMarket)}
        onClickContractInPlace={() => setSubmitStatusCode(ReviewWorkflowStatus.ContractInPlace)}
        onClickDisposedExternally={() => setSubmitStatusCode(ReviewWorkflowStatus.Disposed)}
      />
    </>
  );
};

export default SplTab;
