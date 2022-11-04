import { Button, Form, Input } from 'components/common/form';
import GenericModal from 'components/common/GenericModal';
import TooltipWrapper from 'components/common/TooltipWrapper';
import { Formik } from 'formik';
import { useAdminAreaApi } from 'hooks/useApiAdminAreas';
import React, { useCallback, useEffect, useState } from 'react';
import { ButtonToolbar, Container, Navbar, Spinner } from 'react-bootstrap';
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { isAxiosError } from 'utils';
import { AdministrativeAreaSchema } from 'utils/YupSchema';

import { IAdministrativeArea } from './interfaces';
import { toApiAdminArea } from './utils/utils';

export interface IEditAdminAreaProps {
  /** name used to identify which administrative area to edit */
  name: string;
  match?: any;
}

/** styled container to center the contents of the page */
const EditAdminAreaContainer = styled(Container)`
  justify-content: center;
`;

/** component used to edit specific administrative area selected from the ManageAdminArea component */
const EditAdminArea = (props: IEditAdminAreaProps) => {
  const history = useHistory();
  const { getAdminArea, updateAdminArea, deleteAdminArea, addAdminArea } = useAdminAreaApi();
  const [activeArea, setActiveArea] = useState<IAdministrativeArea>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [duplicateModal, setDuplicateModal] = useState({ show: false, msg: '' });
  const adminAreaId = props?.match?.params?.id;

  /** on delete we want to remove the admin area and go back to the list view */
  const onDelete = async () => {
    if (activeArea) {
      await deleteAdminArea(toApiAdminArea(activeArea));
      history.push('/admin/administrativeareas');
    }
  };
  /** simple function to navigate back to list view */
  const goBack = () => {
    history.push('/admin/administrativeareas');
  };

  /** set the duplicate state back to initial state */
  const handleDuplicateOk = () => {
    setDuplicateModal({ show: false, msg: '' });
  };

  /** used to determine whether updating or adding */
  const newAdminArea = history.location.pathname.includes('/new');

  const getDetails = useCallback(
    async (id: number) => {
      if (!activeArea && !!id) {
        setActiveArea(await getAdminArea(id));
      }
    },
    [activeArea, getAdminArea],
  );

  useEffect(() => {
    if (!newAdminArea) {
      getDetails(adminAreaId);
    }
  }, [getDetails, adminAreaId, activeArea, newAdminArea]);

  return (
    <div>
      <Navbar className="navBar" expand="sm" variant="light" bg="light">
        <Navbar.Brand>
          <TooltipWrapper toolTipId="back" toolTip="Back to administrative area list">
            <FaArrowAltCircleLeft
              onClick={goBack}
              size={20}
              style={{ marginBottom: '0.5rem', cursor: 'pointer' }}
            />
          </TooltipWrapper>
        </Navbar.Brand>
        <h4>Administrative Area</h4>
      </Navbar>
      <Formik
        enableReinitialize
        onSubmit={async values => {
          if (!newAdminArea && activeArea) {
            try {
              await updateAdminArea(adminAreaId, toApiAdminArea(activeArea, values.name));
            } catch (error) {
              if (isAxiosError(error)) {
                setDuplicateModal({ msg: error.response?.data.details, show: true });
              }
            }
          } else if (!!values.name) {
            try {
              const data = await addAdminArea({ name: values.name });
              history.push(`/admin/administrativeArea/${data.id}`);
            } catch (error) {
              if (isAxiosError(error)) {
                setDuplicateModal({ msg: error.response?.data.details, show: true });
              }
            }
          }
        }}
        initialValues={{
          name: activeArea?.name ?? '',
        }}
        validationSchema={AdministrativeAreaSchema}
      >
        <EditAdminAreaContainer>
          {showDeleteModal && (
            <DeleteModal {...{ showDeleteModal, setShowDeleteModal, onDelete }} />
          )}
          {duplicateModal.show && (
            <GenericModal
              message={duplicateModal.msg}
              okButtonText="Ok"
              handleOk={handleDuplicateOk}
            />
          )}
          <Form className="adminAreaInfo">
            {!activeArea && !newAdminArea ? (
              <Spinner animation="border" />
            ) : (
              <Input field="name" label="Name: " type="text" />
            )}
            <ButtonToolbar style={{ justifyContent: 'center' }}>
              <Button className="mr-5" type="submit">
                {newAdminArea ? 'Create Administrative Area' : 'Save Changes'}
              </Button>{' '}
              {!newAdminArea ? (
                <Button
                  className="bg-danger mr-5"
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete
                </Button>
              ) : (
                <Button className="bg-danger mr-5" type="button" onClick={() => goBack()}>
                  Cancel
                </Button>
              )}
            </ButtonToolbar>
          </Form>
        </EditAdminAreaContainer>
      </Formik>
    </div>
  );
};

export default EditAdminArea;

const DeleteModal = ({ setShowDelete, onDelete }: any) => (
  <GenericModal
    message="Are you sure you want to permanently delete this administrative area?"
    cancelButtonText="Cancel"
    okButtonText="Delete"
    handleOk={() => {
      onDelete();
    }}
    handleCancel={() => {
      setShowDelete(false);
    }}
  />
);
