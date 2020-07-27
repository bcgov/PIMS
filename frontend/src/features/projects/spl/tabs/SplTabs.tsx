import * as React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { SPPApprovalTabs, ReviewWorkflowStatus } from '../../common';
import { DocumentationTab } from '../../common';
import { SurplusPropertyInformationTab, SplTab, CloseOutFormTab } from '..';

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
}

/**
 * Tab based formik form for ERP/SPL workflows.
 * @param param0 ISplTabsProps
 */
const SplTabs: React.FunctionComponent<ISplTabsProps> = ({
  currentTab,
  setCurrentTab,
  isReadOnly,
  setSubmitStatusCode,
}) => {
  return (
    <React.Fragment>
      <Tabs activeKey={currentTab} id="approvalTabs" onSelect={(key: string) => setCurrentTab(key)}>
        <Tab eventKey={SPPApprovalTabs.projectInformation} title="Project Information">
          <SurplusPropertyInformationTab isReadOnly={isReadOnly} />
        </Tab>
        <Tab eventKey={SPPApprovalTabs.documentation} title="Documentation">
          <DocumentationTab
            isReadOnly={isReadOnly}
            appraisalTaskStatusCode={ReviewWorkflowStatus.Disposed}
          />
        </Tab>
        <Tab eventKey={SPPApprovalTabs.spl} title="Surplus Properties List">
          <SplTab isReadOnly={isReadOnly} setSubmitStatusCode={setSubmitStatusCode} />
        </Tab>
        <Tab eventKey={SPPApprovalTabs.closeOutForm} title="Close Out Form">
          <CloseOutFormTab isReadOnly={isReadOnly} />
        </Tab>
      </Tabs>
    </React.Fragment>
  );
};

export default SplTabs;
