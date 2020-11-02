import * as React from 'react';
import { Tabs } from 'react-bootstrap';
import { tabErrorWarning } from '../../features/projects/common';
import { useFormikContext } from 'formik';
import GenericModal from 'components/common/GenericModal';
import { useState } from 'react';

interface IErrorTabsProps {
  /** The currently displayed tab */
  currentTab: string;
  /** set the currently displayed tab */
  setCurrentTab: Function;
}

/**
 * Tab based wrapper for formik forms. Displays error modal if formik submit fails due to validation error.
 * @param param0 IErrorTabsProps
 */
const ErrorTabs: React.FunctionComponent<IErrorTabsProps> = ({
  currentTab,
  setCurrentTab,
  ...rest
}) => {
  const { errors, isSubmitting } = useFormikContext<any>();
  const [listenToSubmit, setListenToSubmit] = useState(false);
  const [, setShowTabErrors] = useState(false);
  const [showTabErrorModal, setShowTabErrorModal] = useState(false);

  /** Once formik is no longer submitting the form, see if there are any form errors. */
  React.useEffect(() => {
    if (!isSubmitting && listenToSubmit && Object.keys(errors).length !== 0) {
      setShowTabErrors(true);
      setShowTabErrorModal(true);
    }
    setListenToSubmit(isSubmitting);
  }, [errors, isSubmitting, listenToSubmit]);

  return (
    <React.Fragment>
      <Tabs
        activeKey={currentTab}
        id="approvalTabs"
        mountOnEnter={true}
        unmountOnExit={true}
        onSelect={(key: string) => setCurrentTab(key)}
      >
        {rest.children}
      </Tabs>
      {showTabErrorModal && (
        <GenericModal
          display={showTabErrorModal}
          okButtonText="Ok"
          handleOk={() => {
            setShowTabErrorModal(false);
          }}
          handleCancel={() => {
            setShowTabErrorModal(false);
          }}
          title="The form has errors"
          message={tabErrorWarning}
        />
      )}
    </React.Fragment>
  );
};

export default ErrorTabs;
