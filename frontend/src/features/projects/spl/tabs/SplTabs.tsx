import * as React from 'react';
import { Tab } from 'react-bootstrap';
import { SPPApprovalTabs, ReviewWorkflowStatus, IProject, useStepForm } from '../../common';
import { DocumentationTab } from '../../common';
import { SurplusPropertyInformationTab, SplTab, CloseOutFormTab } from '..';
import { useFormikContext } from 'formik';
import ErrorTabs from 'components/common/ErrorTabs';
import { EnhancedReferralTab } from 'features/projects/erp';
import { noop } from 'lodash';
import { isTabInError } from 'components/common/tabValidation';

interface ISplTabsProps {
  /** The currently displayed tab */
  currentTab: string;
  /** set the currently displayed tab */
  setCurrentTab: Function;
  /** disable all tab content if true */
  isReadOnly?: boolean;
  /** Used to signal the need for an api request at the given status */
  submitStatusCode?: string;
  /** status code update triggered by a form action. Will trigger a status transition if set. */
  setSubmitStatusCode: Function;
  /** Function that will navigate to the gre transferred form when executed */
  goToGreTransferred: Function;
}

/**
 * Tab based formik form for the SPL workflow.
 * @param param0 ISplTabsProps
 */
export const SplTabs: React.FunctionComponent<ISplTabsProps> = ({
  currentTab,
  setCurrentTab,
  isReadOnly,
  setSubmitStatusCode,
  goToGreTransferred,
}) => {
  const { submitForm, values, errors } = useFormikContext<IProject>();
  const { canUserOverride } = useStepForm();
  const canOverride = canUserOverride();
  return (
    <React.Fragment>
      <ErrorTabs setCurrentTab={setCurrentTab} currentTab={currentTab}>
        <Tab
          eventKey={SPPApprovalTabs.projectInformation}
          title="Project Information"
          tabClassName={isTabInError(errors, SPPApprovalTabs.projectInformation)}
        >
          <SurplusPropertyInformationTab isReadOnly={isReadOnly} />
        </Tab>
        <Tab
          eventKey={SPPApprovalTabs.documentation}
          title="Documentation"
          tabClassName={isTabInError(errors, SPPApprovalTabs.documentation)}
        >
          <DocumentationTab
            canOverride={canOverride}
            isReadOnly={isReadOnly}
            appraisalTaskStatusCode={ReviewWorkflowStatus.Disposed}
          />
        </Tab>
        <Tab
          eventKey={SPPApprovalTabs.erp}
          title={`${
            values.statusCode === ReviewWorkflowStatus.ApprovedForExemption
              ? 'Exemption from the Enhanced Referral Process'
              : 'Enhanced Referral Process'
          }`}
          tabClassName={isTabInError(errors, SPPApprovalTabs.erp)}
        >
          <EnhancedReferralTab
            isReadOnly={!canOverride}
            setSubmitStatusCode={setSubmitStatusCode}
            goToGreTransferred={noop}
          />
        </Tab>
        <Tab
          eventKey={SPPApprovalTabs.spl}
          title="Surplus Properties List"
          tabClassName={isTabInError(errors, SPPApprovalTabs.spl)}
        >
          <SplTab
            isReadOnly={isReadOnly}
            setSubmitStatusCode={setSubmitStatusCode}
            goToGreTransferred={() => submitForm().then(() => goToGreTransferred())}
          />
        </Tab>
        <Tab
          eventKey={SPPApprovalTabs.closeOutForm}
          title="Close Out Form"
          tabClassName={isTabInError(errors, SPPApprovalTabs.closeOutForm)}
        >
          <CloseOutFormTab isReadOnly={isReadOnly} />
        </Tab>
      </ErrorTabs>
    </React.Fragment>
  );
};

export default SplTabs;
