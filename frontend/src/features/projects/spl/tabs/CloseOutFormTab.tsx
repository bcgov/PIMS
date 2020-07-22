import * as React from 'react';
import {
  CloseOutFinancialsForm,
  CloseOutSummaryForm,
  CloseOutPurchaseInformationForm,
  CloseOutSaleInformationForm,
  CloseOutFinancialSummaryForm,
  CloseOutSignaturesForm,
  CloseOutAdjustmentForm,
} from '..';
import { ProjectNotes, NoteTypes, projectComments } from 'features/projects/common';

interface ICloseOutFormTabProps {
  isReadOnly?: boolean;
}

/**
 * Close out form tab.
 * @param param0 ICloseOutFormTabProps
 */
const CloseOutFormTab: React.FunctionComponent<ICloseOutFormTabProps> = ({
  isReadOnly,
}: ICloseOutFormTabProps) => {
  return (
    <>
      <CloseOutSummaryForm isReadOnly={isReadOnly} />
      <CloseOutPurchaseInformationForm isReadOnly={isReadOnly} />
      <CloseOutSaleInformationForm isReadOnly={isReadOnly} />
      <CloseOutFinancialSummaryForm isReadOnly={isReadOnly} />
      <CloseOutFinancialsForm isReadOnly={isReadOnly} />
      <ProjectNotes
        field={`notes[${NoteTypes.SalesHistory}].note`}
        label="Sales History Notes"
        outerClassName="col-md-12"
      />
      <ProjectNotes
        field={`notes[${NoteTypes.Comments}].note`}
        label="Project Comments"
        outerClassName="col-md-12"
        tooltip={projectComments}
      />
      <CloseOutSignaturesForm isReadOnly={isReadOnly} />
      <CloseOutAdjustmentForm isReadOnly={isReadOnly} />
    </>
  );
};

export default CloseOutFormTab;
