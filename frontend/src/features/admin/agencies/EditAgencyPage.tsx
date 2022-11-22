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
import { Button, ButtonToolbar, Container, Navbar, Row } from 'react-bootstrap';
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
import {
  createAgency,
  deleteAgency,
  fetchAgencyDetail,
  getUpdateAgencyAction,
} from 'store/slices/hooks/agencyActionCreator';
import { AgencyEditSchema } from 'utils/YupSchema';

import { Check, Form, Input, Select, SelectOption } from '../../../components/common/form';

interface IEditAgencyPageProps {
  /** id prop to identify which agency to edit */
  id: number;
  match?: any;
}

/** This page is used to either add a new agency or edit the and agency's details */
const EditAgencyPage = (props: IEditAgencyPageProps) => {
  const agencyId = props?.match?.params?.id || props.id;
  const history = useHistory();
  const dispatch = useAppDispatch();
  const newAgency = history.location.pathname.includes('/new');
  const [showDelete, setShowDelete] = useState(false);
  const [showFailed, setShowFailed] = useState(false);
  useEffect(() => {
    if (!newAgency) {
      fetchAgencyDetail({ id: agencyId })(dispatch);
    }
  }, [dispatch, agencyId, newAgency]);

  const { getByType } = useCodeLookups();
  const agencies = getByType(API.AGENCY_CODE_SET_NAME).filter(x => !x.parentId);

  const agency = useAppSelector(store => store.agencies.agencyDetail);
  const mapLookupCode = (code: ILookupCode): SelectOption => ({
    label: code.name,
    value: code.id.toString(),
    selected: !!agency.parentId,
    parent: '',
  });
  //
  const selectAgencies = agencies.map(c => mapLookupCode(c));
  const checkAgencies = (
    <Select
      label="Parent Agency - If applicable"
      field="parentId"
      options={selectAgencies}
      disabled={!agency.parentId && !newAgency}
      placeholder={newAgency ? 'Please select if applicable' : 'No parent'}
    />
  );

  const goBack = () => {
    history.push('/admin/agencies');
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
      {showDelete && <DeleteModal {...{ showDelete, setShowDelete, history, dispatch, agency }} />}
      {showFailed && <FailedDeleteModal {...{ showFailed, setShowFailed }} />}
      <Navbar className="navBar" expand="sm" variant="light" bg="light">
        <Navbar.Brand>
          {' '}
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
                  history.replace(`/admin/agency/${data.id}`);
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
            {props => (
              <Form className="agencyInfo">
                <Input
                  label="Agency"
                  aria-label="Agency"
                  required
                  field="name"
                  value={props.values.name}
                  type="text"
                />
                <Input
                  label="Short Name (Code)"
                  aria-label="Short Name (Code)"
                  field="code"
                  value={props.values.code}
                  type="text"
                  required
                />
                {checkAgencies}
                <Input label="Description" field="description" type="text" />
                <Input label="Email address" aria-label="Email address" field="email" type="text" />
                <Input label="Addressed To" field="addressTo" type="text" />
                <Input label="CC Email address" field="ccEmail" type="text" />

                <Form.Group className="checkboxes">
                  <TooltipWrapper
                    toolTip="Click to change Agency status then click Save Changes."
                    toolTipId="is-disabled-tooltip"
                  >
                    <Check field="isDisabled" label="Disable Agency?" />
                  </TooltipWrapper>
                  <TooltipWrapper
                    toolTip="Click to enable to email notifications for Agency then click Save Changes."
                    toolTipId="email-tooltip"
                  >
                    <Check
                      field="sendEmail"
                      label="Email Notifications?"
                      aria-label="Email Notifications?"
                    />
                  </TooltipWrapper>
                </Form.Group>

                <hr></hr>
                <Row className="buttons">
                  <ButtonToolbar className="cancelSave">
                    {!newAgency ? (
                      <Button
                        className="bg-danger mr-5"
                        type="button"
                        onClick={async () => {
                          const data = await service.getPropertyList({
                            page: 1,
                            quantity: 10,
                            agencies: agencyId,
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
                      <Button className="bg-danger mr-5" type="button" onClick={() => goBack()}>
                        Cancel
                      </Button>
                    )}

                    <Button className="mr-5" type="submit">
                      {newAgency ? 'Submit Agency' : 'Save Changes'}
                    </Button>
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

const DeleteModal = ({ showDelete, setShowDelete, history, dispatch, agency }: any) => (
  <GenericModal
    message="Are you sure you want to permanently delete the agency?"
    cancelButtonText="Cancel"
    okButtonText="Delete"
    display={showDelete}
    handleOk={() => {
      dispatch(deleteAgency(agency)).then(() => {
        history.push('/admin/agencies');
      });
    }}
    handleCancel={() => {
      setShowDelete(false);
    }}
  />
);

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
