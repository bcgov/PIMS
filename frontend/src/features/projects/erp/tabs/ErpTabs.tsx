import ErrorTabs from 'components/common/ErrorTabs';
import { isTabInError } from 'components/common/tabValidation';
import { ReviewWorkflowStatus, SPPApprovalTabs } from 'features/projects/constants';
import { defaultProject } from 'features/projects/constants/defaultValues';
import { IProject } from 'features/projects/interfaces';
import { CloseOutFormTab, SplTab } from 'features/projects/spl';
import { useFormikContext } from 'formik';
import { isEqual } from 'lodash';
import * as React from 'react';
import { Spinner, Tab } from 'react-bootstrap';

import { useStepForm } from '../../common';
import { DocumentationTab, NotificationTab, ProjectInformationTab } from '../../common';
import { EnhancedReferralTab } from '..';

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
  const { submitForm, values, errors } = useFormikContext<IProject>();
  const { canUserOverride } = useStepForm();
  const canOverride = canUserOverride();
  if (isEqual(values, defaultProject())) {
    return <Spinner animation="border" />;
  }

  return (
    <>
      <ErrorTabs setCurrentTab={setCurrentTab} currentTab={currentTab}>
        <Tab
          eventKey={SPPApprovalTabs.projectInformation}
          title="Project Information"
          tabClassName={isTabInError(errors, SPPApprovalTabs.projectInformation)}
        >
          <ProjectInformationTab isReadOnly={isReadOnly} />
        </Tab>
        <Tab
          eventKey={SPPApprovalTabs.documentation}
          title="Documentation"
          tabClassName={isTabInError(errors, SPPApprovalTabs.documentation)}
        >
          <DocumentationTab canOverride={canOverride} isReadOnly={isReadOnly} />
        </Tab>
        <Tab
          tabClassName={isTabInError(errors, SPPApprovalTabs.erp)}
          eventKey={SPPApprovalTabs.erp}
          title={`${
            values.exemptionRequested
              ? 'Exemption from the Enhanced Referral Process'
              : 'Enhanced Referral Process'
          }`}
        >
          <EnhancedReferralTab
            isReadOnly={isReadOnly}
            setSubmitStatusCode={setSubmitStatusCode}
            goToGreTransferred={() => submitForm().then(() => goToGreTransferred())}
          />
        </Tab>
        <Tab
          eventKey={SPPApprovalTabs.notification}
          title="Notification Information"
          tabClassName={isTabInError(errors, SPPApprovalTabs.notification)}
        >
          <NotificationTab isReadOnly={isReadOnly} />
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
        {values.statusCode === ReviewWorkflowStatus.NotInSpl && (
          <Tab
            eventKey={SPPApprovalTabs.closeOutForm}
            title="Close Out Form"
            tabClassName={isTabInError(errors, SPPApprovalTabs.closeOutForm)}
          >
            <CloseOutFormTab isReadOnly={isReadOnly} />
          </Tab>
        )}
      </ErrorTabs>
    </>
  );
};

export default ErpTabs;
