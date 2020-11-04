import React from 'react';
import GenericModal from 'components/common/GenericModal';
import { useHistory } from 'react-router-dom';
import { PARCEL_STORAGE_NAME, clearStorage, isStorageInUse } from 'utils/storageUtils';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';

const OnLoadActions: React.FC = () => {
  const history = useHistory();
  const keycloak = useKeycloakWrapper();
  return (
    <GenericModal
      title="Unsaved Draft"
      message="You have an unsaved Property Draft, would you like to resume editing it?"
      cancelButtonText="Discard"
      okButtonText="Resume Editing"
      display={
        !history.location.pathname.includes('/mapview') &&
        isStorageInUse(PARCEL_STORAGE_NAME) &&
        keycloak?.obj?.authenticated
      }
      handleOk={() => {
        history.push('/mapview?sidebar=true&loadDraft=true');
      }}
      handleCancel={() => {
        clearStorage(PARCEL_STORAGE_NAME);
      }}
    />
  );
};

export default OnLoadActions;
