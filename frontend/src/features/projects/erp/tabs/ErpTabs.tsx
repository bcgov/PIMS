import * as React from 'react';
import { Tab, Tabs, Spinner } from 'react-bootstrap';
import { SPPApprovalTabs, initialValues, ReviewWorkflowStatus } from '../../common';
import { useFormikContext } from 'formik';
import { EnhancedReferralTab } from '..';
import { isEqual } from 'lodash';
import { ProjectInformationTab, DocumentationTab } from '../../common';

interface IErpTabsProps {
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
 * @param param0 IErpTabsProps
 */
const ErpTabs: React.FunctionComponent<IErpTabsProps> = ({
  currentTab,
  setCurrentTab,
  isReadOnly,
  setSubmitStatusCode,
  goToGreTransferred,
}) => {
  const { submitForm, values } = useFormikContext();

  if (isEqual(values, initialValues)) {
    return <Spinner animation="border" />;
  }

  return (
    <React.Fragment>
      <Tabs activeKey={currentTab} id="approvalTabs" onSelect={(key: string) => setCurrentTab(key)}>
        <Tab eventKey={SPPApprovalTabs.projectInformation} title="Project Information">
          {currentTab === SPPApprovalTabs.projectInformation && (
            <ProjectInformationTab isReadOnly={isReadOnly} />
          )}
        </Tab>
        <Tab eventKey={SPPApprovalTabs.documentation} title="Documentation">
          {currentTab === SPPApprovalTabs.documentation && (
            <DocumentationTab isReadOnly={isReadOnly} />
          )}
        </Tab>
        <Tab
          eventKey={SPPApprovalTabs.erp}
          title={`${
            (values as any).statusCode === ReviewWorkflowStatus.ApprovedForExemption
              ? 'Exemption from the Enhanced Referral Process'
              : 'Enhanced Referral Process'
          }`}
        >
          {currentTab === SPPApprovalTabs.erp && (
            <EnhancedReferralTab
              isReadOnly={isReadOnly}
              setSubmitStatusCode={setSubmitStatusCode}
              goToGreTransferred={() => submitForm().then(() => goToGreTransferred())}
            />
          )}
        </Tab>
      </Tabs>
    </React.Fragment>
  );
};

export default ErpTabs;
