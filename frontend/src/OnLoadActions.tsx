import React from 'react';
import GenericModal from 'components/common/GenericModal';
import { useHistory } from 'react-router-dom';
import { PARCEL_STORAGE_NAME, clearStorage, isStorageInUse } from 'utils/storageUtils';

const OnLoadActions: React.FC = () => {
  const history = useHistory();

  return (
    <GenericModal
      title="Unsaved Draft"
      message="You have an unsaved Property Draft, would you like to resume editing it?"
      cancelButtonText="Discard"
      okButtonText="Resume Editing"
      display={
        history.location.pathname !== '/submitProperty' && isStorageInUse(PARCEL_STORAGE_NAME)
      }
      handleOk={() => {
        history.push('/submitProperty?loadDraft=true');
      }}
      handleCancel={() => {
        clearStorage(PARCEL_STORAGE_NAME);
      }}
    />
  );
};

export default OnLoadActions;
