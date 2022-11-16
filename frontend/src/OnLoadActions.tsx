import GenericModal from 'components/common/GenericModal';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearStorage, isStorageInUse, PARCEL_STORAGE_NAME } from 'utils/storageUtils';

const OnLoadActions: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const keycloak = useKeycloakWrapper();
  return (
    <GenericModal
      title="Unsaved Draft"
      message="You have an unsaved Property Draft, would you like to resume editing it?"
      cancelButtonText="Discard"
      okButtonText="Resume Editing"
      display={
        !location.pathname.includes('/mapview') &&
        isStorageInUse(PARCEL_STORAGE_NAME) &&
        keycloak?.obj?.authenticated
      }
      handleOk={() => {
        navigate('/mapview?sidebar=true&loadDraft=true');
      }}
      handleCancel={() => {
        clearStorage(PARCEL_STORAGE_NAME);
      }}
    />
  );
};

export default OnLoadActions;
