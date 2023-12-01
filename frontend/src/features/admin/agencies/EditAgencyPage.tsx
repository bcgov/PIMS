import './EditAgencyPage.scss';

import { ILookupCode } from 'actions/ILookupCode';
import { AxiosError } from 'axios';
import GenericModal from 'components/common/GenericModal';
import TooltipWrapper from 'components/common/TooltipWrapper';
import * as API from 'constants/API';
import service from 'features/properties/service';
import { Formik } from 'formik';
import useCodeLookups from 'hooks/useLookupCodes';
import { IAgencyDetail } from 'interfaces';
import React, { useEffect, useState } from 'react';
import { Button, ButtonToolbar, Col, Container, Navbar, Row } from 'react-bootstrap';
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
import {
  createAgency,
  deleteAgency,
  fetchAgencyDetail,
  getUpdateAgencyAction,
} from 'store/slices/hooks/agencyActionCreator';
import { AgencyEditSchema } from 'utils/YupSchema';

import { Check, Form, Input, Select, SelectOption } from '../../../components/common/form';

/** This page is used to either add a new agency or edit the and agency's details */
const EditAgencyPage = () => {
  const params = useParams();
  // removing the double quotes surrounding the id from useParams() as stringify isn't removing those double quotes surrounding the id.
  const agencyId = params.id ? JSON.stringify(params.id).slice(1, -1) : '';

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const newAgency = location.pathname.includes('/new');
  const [showDelete, setShowDelete] = useState(false);
  const [showFailed, setShowFailed] = useState(false);
  useEffect(() => {
    if (!newAgency) {
      fetchAgencyDetail({ id: agencyId })(dispatch);
    }
  }, [dispatch, agencyId, newAgency]);

  const { getByType } = useCodeLookups();
  const agencies = getByType(API.AGENCY_CODE_SET_NAME).filter((x) => !x.parentId);

  const agency = useAppSelector((store) => store.agencies.agencyDetail);
  const mapLookupCode = (code: ILookupCode): SelectOption => ({
    label: code.name,
    value: code.id.toString(),
    selected: !!agency.parentId,
    parent: '',
  });
  //
  const selectAgencies = agencies.map((c) => mapLookupCode(c));

  const goBack = () => {
    navigate('/admin/agencies');
  };

  const newValues: any = {
    code: '',
    name: '',
    description: '',
    isDisabled: false,
    sendEmail: true,
    email: '',
    ccEmail: '',
    addressTo: '',
    rowVersion: '',
  };

  const initialValues: IAgencyDetail = {
    ...newValues,
    ...agency,
  };

  return (
    <div>
      {showDelete && <DeleteModal {...{ showDelete, setShowDelete, navigate, dispatch, agency }} />}
      {showFailed && <FailedDeleteModal {...{ showFailed, setShowFailed }} />}
      <Navbar className="navBar" expand="sm" variant="light" bg="light">
        <Navbar.Brand style={{ marginLeft: '10px' }}>
          <TooltipWrapper toolTipId="back" toolTip="Back to Agency list">
            <FaArrowAltCircleLeft onClick={goBack} size={20} />
          </TooltipWrapper>
        </Navbar.Brand>
        <h4>Agency Information</h4>
      </Navbar>
      <Container fluid={true}>
        <Row className="agency-edit-form-container">
          <Formik
            enableReinitialize
            initialValues={newAgency ? newValues : initialValues}
            validationSchema={AgencyEditSchema}
            onSubmit={async (values, { setSubmitting, setStatus }) => {
              try {
                if (!newAgency) {
                  getUpdateAgencyAction(
                    { id: agencyId },
                    {
                      id: agency.id,
                      name: values.name,
                      code: values.code,
                      email: values.email,
                      ccEmail: values.ccEmail,
                      isDisabled: values.isDisabled,
                      sendEmail: values.sendEmail,
                      addressTo: values.addressTo,
                      parentId: values.parentId ? Number(values.parentId) : undefined,
                      description: values.description,
                      rowVersion: values.rowVersion,
                    },
                  )(dispatch);
                } else {
                  const data = await createAgency({
                    name: values.name,
                    code: values.code,
                    email: values.email,
                    isDisabled: values.isDisabled,
                    sendEmail: values.sendEmail,
                    addressTo: values.addressTo,
                    parentId: Number(values.parentId),
                    description: values.description,
                  })(dispatch);
                  navigate(`/admin/agency/${data.id}`);
                }
              } catch (error) {
                const err = error as AxiosError<any>;
                const msg: string =
                  err?.response?.data?.error ?? 'Error saving property data, please try again.';
                setStatus({ msg });
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {(props) => (
              <Form>
                <table className="table-style">
                  <tr>
                    <td className="left-col">
                      <div className="form-label">Agency</div>
                    </td>
                    <td className="right-col">
                      <Input
                        aria-label="Agency"
                        className="form-text-field"
                        required
                        field="name"
                        value={props.values.name}
                        type="text"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="left-col">
                      <div className="form-label">Short Name (Code)</div>
                    </td>
                    <td className="right-col">
                      <Input
                        aria-label="Short Name (Code)"
                        className="form-text-field"
                        field="code"
                        value={props.values.code}
                        type="text"
                        required
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="left-col">
                      <div className="form-label">Parent Agency - If applicable</div>
                    </td>
                    <td className="right-col">
                      <Select
                        field="parentId"
                        className="form-select-field"
                        options={selectAgencies}
                        disabled={!agency.parentId && !newAgency}
                        placeholder={newAgency ? 'Please select if applicable' : 'No parent'}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="left-col">
                      <div className="form-label">Description</div>
                    </td>
                    <td className="right-col">
                      <Input field="description" className="form-text-field" type="text" />
                    </td>
                  </tr>
                  <tr>
                    <td className="left-col">
                      <div className="form-label">Email address</div>
                    </td>
                    <td className="right-col">
                      <Input
                        aria-label="Email address"
                        className="form-text-field"
                        field="email"
                        type="text"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="left-col">
                      <div className="form-label">Addressed To</div>
                    </td>
                    <td className="right-col">
                      <Input field="addressTo" className="form-text-field" type="text" />
                    </td>
                  </tr>
                  <tr>
                    <td className="left-col">
                      <div className="form-label">CC Email address</div>
                    </td>
                    <td className="right-col">
                      <Input field="ccEmail" className="form-text-field" type="text" />
                    </td>
                  </tr>
                </table>

                <hr></hr>

                <Row className="checkboxes">
                  <Col md="auto">
                    <TooltipWrapper
                      toolTip="Click to change Agency status then click Save Changes."
                      toolTipId="is-disabled-tooltip"
                    >
                      <Check field="isDisabled" label="Disable Agency?" />
                    </TooltipWrapper>
                  </Col>
                  <Col md="auto">
                    <TooltipWrapper
                      toolTip="Click to enable email notifications for Agency then click Save Changes."
                      toolTipId="email-tooltip"
                    >
                      <Check
                        field="sendEmail"
                        label="Email Notifications?"
                        aria-label="Email Notifications?"
                      />
                    </TooltipWrapper>
                  </Col>
                </Row>

                <Row>
                  <ButtonToolbar>
                    {!newAgency ? (
                      <Button
                        className="bg-danger"
                        style={{ marginLeft: '20px', marginRight: '40px' }}
                        type="button"
                        onClick={async () => {
                          const data = await service.getPropertyList({
                            page: 1,
                            quantity: 10,
                            agencies: parseInt(agencyId),
                          });
                          if (data.total === 0) {
                            setShowDelete(true);
                          } else {
                            setShowFailed(true);
                          }
                        }}
                      >
                        Delete Agency
                      </Button>
                    ) : (
                      <Button
                        style={{ marginRight: '40px' }}
                        className="bg-danger"
                        type="button"
                        onClick={() => goBack()}
                      >
                        Cancel
                      </Button>
                    )}

                    <Button type="submit">{newAgency ? 'Submit Agency' : 'Save Changes'}</Button>
                  </ButtonToolbar>
                </Row>
              </Form>
            )}
          </Formik>
        </Row>
      </Container>
    </div>
  );
};

export default EditAgencyPage;

const DeleteModal = ({ showDelete, setShowDelete, dispatch, agency }: any) => {
  const navigate = useNavigate();
  return (
    <GenericModal
      message="Are you sure you want to permanently delete the agency?"
      cancelButtonText="Cancel"
      okButtonText="Delete"
      display={showDelete}
      handleOk={() => {
        dispatch(deleteAgency(agency)).then(() => {
          navigate('/admin/agencies');
        });
      }}
      handleCancel={() => {
        setShowDelete(false);
      }}
    />
  );
};

const FailedDeleteModal = ({ showFailed, setShowFailed }: any) => (
  <GenericModal
    message="You are not able to delete this agency as there are properties currently associated with it."
    okButtonText="Ok"
    display={showFailed}
    handleOk={() => {
      setShowFailed(false);
    }}
  />
);
