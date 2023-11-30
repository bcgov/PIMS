import './EditAdminArea.scss';

import { AxiosError } from 'axios';
import { Button, Form, Input } from 'components/common/form';
import GenericModal from 'components/common/GenericModal';
import TooltipWrapper from 'components/common/TooltipWrapper';
import { Formik } from 'formik';
import { useAdminAreaApi } from 'hooks/useApiAdminAreas';
import React, { useCallback, useEffect, useState } from 'react';
import { ButtonToolbar, Col, Navbar, Row, Spinner } from 'react-bootstrap';
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import { isAxiosError } from 'utils';
import { AdministrativeAreaSchema } from 'utils/YupSchema';

import { IAdministrativeArea } from './interfaces';
import { toApiAdminArea } from './utils/utils';

export interface IEditAdminAreaProps {
  /** name used to identify which administrative area to edit */
  name: string;
  match?: any;
}

/** component used to edit specific administrative area selected from the ManageAdminArea component */
const EditAdminArea = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getAdminArea, updateAdminArea, deleteAdminArea, addAdminArea } = useAdminAreaApi();
  const [activeArea, setActiveArea] = useState<IAdministrativeArea>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [duplicateModal, setDuplicateModal] = useState({ show: false, msg: '' });
  const params = useParams();
  // removing the double quotes surrounding the id from useParams() as stringify isn't removing those double quotes surrounding the id.
  // set aminAreaId to 0 when creating a new admin area
  const adminAreaId = params.id ? parseInt(JSON.stringify(params.id).slice(1, -1)) : 0;

  /** on delete we want to remove the admin area and go back to the list view */
  const onDelete = async () => {
    if (activeArea) {
      await deleteAdminArea(toApiAdminArea(activeArea));
      navigate('/admin/administrativeareas');
    }
  };
  /** simple function to navigate back to list view */
  const goBack = () => {
    navigate('/admin/administrativeareas');
  };

  /** set the duplicate state back to initial state */
  const handleDuplicateOk = () => {
    setDuplicateModal({ show: false, msg: '' });
  };

  /** used to determine whether updating or adding */
  const newAdminArea = location.pathname.includes('/new');

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
      <Navbar className="navBar nav-bar-admin" expand="sm" variant="light">
        <Navbar.Brand>
          <TooltipWrapper toolTipId="back" toolTip="Back to administrative area list">
            <FaArrowAltCircleLeft onClick={goBack} className="back-icon" />
          </TooltipWrapper>
        </Navbar.Brand>
        <p className="text-header">Administrative Area</p>
      </Navbar>
      <Formik
        enableReinitialize
        onSubmit={async (values) => {
          if (!newAdminArea && activeArea) {
            try {
              await updateAdminArea(adminAreaId, toApiAdminArea(activeArea, values.name));
            } catch (error) {
              if (isAxiosError(error)) {
                const err = error as AxiosError<any>;
                setDuplicateModal({ msg: err.response?.data.details, show: true });
              }
            }
          } else if (!!values.name) {
            try {
              const data = await addAdminArea({ name: values.name });
              navigate(`/admin/administrativeArea/${data.id}`);
            } catch (error) {
              if (isAxiosError(error)) {
                const err = error as AxiosError<any>;
                setDuplicateModal({ msg: err.response?.data.details, show: true });
              }
            }
          }
        }}
        initialValues={{
          name: activeArea?.name ?? '',
        }}
        validationSchema={AdministrativeAreaSchema}
      >
        <div className="container-edit-admin">
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
              <Row className="edit-admin-form">
                <Col className="col-2">
                  <div>Name: </div>
                </Col>
                <Col className="col-3">
                  <Input field="name" type="text" />
                </Col>
              </Row>
            )}
            <ButtonToolbar style={{ justifyContent: 'center' }}>
              <Button style={{ marginRight: '10px' }} type="submit">
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
        </div>
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
