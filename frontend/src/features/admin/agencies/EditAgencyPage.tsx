import React, { useEffect, useState } from 'react';
import { Navbar, Container, Row, ButtonToolbar, Button } from 'react-bootstrap';
import { Check, Form, Input, Select, SelectOption } from '../../../components/common/form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { IAgencyDetail } from 'interfaces';
import { Formik } from 'formik';
import * as API from 'constants/API';
import './EditAgencyPage.scss';
import { useHistory } from 'react-router-dom';
import useCodeLookups from 'hooks/useLookupCodes';
import { ILookupCode } from 'actions/lookupActions';
import {
  createAgency,
  deleteAgency,
  fetchAgencyDetail,
  getUpdateAgencyAction,
} from 'actionCreators/agencyActionCreator';
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import GenericModal from 'components/common/GenericModal';
import { AgencyEditSchema } from 'utils/YupSchema';
import service from 'features/properties/service';
import TooltipWrapper from 'components/common/TooltipWrapper';

interface IEditAgencyPageProps {
  /** id prop to identify which agency to edit */
  id: number;
  match?: any;
}

/** This page is used to either add a new agency or edit the and agency's details */
const EditAgencyPage = (props: IEditAgencyPageProps) => {
  const agencyId = props?.match?.params?.id || props.id;
  const history = useHistory();
  const dispatch = useDispatch();
  const newAgency = history.location.pathname.includes('/new');
  const [showDelete, setShowDelete] = useState(false);
  const [showFailed, setShowFailed] = useState(false);
  useEffect(() => {
    if (!newAgency) {
      dispatch(fetchAgencyDetail({ id: agencyId }));
    }
  }, [dispatch, agencyId, newAgency]);

  const { getByType } = useCodeLookups();
  const agencies = getByType(API.AGENCY_CODE_SET_NAME).filter(x => !x.parentId);

  const agency = useSelector<RootState, IAgencyDetail>(
    state => state.GET_AGENCY_DETAIL as IAgencyDetail,
  );
  const mapLookupCode = (code: ILookupCode): SelectOption => ({
    label: code.name,
    value: code.id.toString(),
    selected: !!agency.parentId,
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
                  dispatch(
                    getUpdateAgencyAction(
                      { id: agencyId },
                      {
                        id: agency.id,
                        name: values.name,
                        code: values.code,
                        email: values.email,
                        isDisabled: values.isDisabled,
                        sendEmail: values.sendEmail,
                        addressTo: values.addressTo,
                        parentId: values.parentId ? Number(values.parentId) : undefined,
                        description: values.description,
                        rowVersion: values.rowVersion,
                      },
                    ),
                  );
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
                const msg: string =
                  error?.response?.data?.error ?? 'Error saving property data, please try again.';
                setStatus({ msg });
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {props => (
              <Form className="agencyInfo">
                <Input label="Agency" required field="name" value={props.values.name} type="text" />
                <Input
                  label="Short Name (Code)"
                  field="code"
                  value={props.values.code}
                  type="text"
                  required
                />
                {checkAgencies}
                <Input label="Description" field="description" type="text" />
                <Input label="Agency e-mail address" field="email" type="text" />
                <Input label="Email Addressed To" field="addressTo" type="text" />

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
                    <Check field="sendEmail" label="Email Notifications?" />
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
