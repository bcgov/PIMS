import * as React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { EnhancedReferralTab, ProjectInformationTab, DocumentationTab } from '../../assess';
import { SPPApprovalTabs } from '../../common';
import { useFormikContext } from 'formik';

interface IApprovalFormProps {
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
 * Tab based formik form for ERP/SPL workflows.
 * @param param0 IApprovalFormProps
 */
const ApprovalForm: React.FunctionComponent<IApprovalFormProps> = ({
  currentTab,
  setCurrentTab,
  isReadOnly,
  setSubmitStatusCode,
  goToGreTransferred,
}) => {
  const { submitForm } = useFormikContext();
  return (
    <React.Fragment>
      <Tabs activeKey={currentTab} id="approvalTabs" onSelect={(key: string) => setCurrentTab(key)}>
        <Tab eventKey={SPPApprovalTabs.projectInformation} title="Project Information">
          <ProjectInformationTab isReadOnly={isReadOnly} />
        </Tab>
        <Tab eventKey={SPPApprovalTabs.documentation} title="Documentation">
          <DocumentationTab isReadOnly={isReadOnly} />
        </Tab>
        <Tab eventKey={SPPApprovalTabs.erp} title="Enhanced Referral Process">
          <EnhancedReferralTab
            isReadOnly={isReadOnly}
            setSubmitStatusCode={setSubmitStatusCode}
            goToGreTransferred={() => submitForm().then(() => goToGreTransferred())}
          />
        </Tab>
        <Tab eventKey={SPPApprovalTabs.spl} title="Surplus Properties List"></Tab>
      </Tabs>
    </React.Fragment>
  );
};

export default ApprovalForm;
