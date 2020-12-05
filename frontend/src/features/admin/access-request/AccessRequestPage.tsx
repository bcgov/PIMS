import React, { useEffect } from 'react';
import './AccessRequestPage.scss';
import { Container, Row, Col, ButtonToolbar, Button, Alert } from 'react-bootstrap';
import {
  getCurrentAccessRequestAction,
  getSubmitAccessRequestAction,
  toAccessRequest,
} from 'actionCreators/accessRequestActionCreator';
import { IUserInfo, IAccessRequest } from 'interfaces';
import { Formik } from 'formik';
import { Form, Input, TextArea, Select } from '../../../components/common/form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { IAccessRequestState } from 'reducers/accessRequestReducer';
import * as API from 'constants/API';
import { DISCLAIMER_URL, PRIVACY_POLICY_URL } from 'constants/strings';
import { AccessRequestSchema } from 'utils/YupSchema';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { mapLookupCode } from 'utils';
import { AccessRequestStatus } from 'constants/accessStatus';
import { Snackbar, ISnackbarState } from 'components/common/Snackbar';
import useCodeLookups from 'hooks/useLookupCodes';
import TooltipWrapper from 'components/common/TooltipWrapper';
import { AUTHORIZATION_URL } from 'constants/strings';

interface IAccessRequestForm extends IAccessRequest {
  agency: number;
  role: string;
}

/**
 * The AccessRequestPage provides a way to new authenticated users to submit a request
 * that associates them with a specific agency and a role within the agency.
 * If they have an active access request already submitted, it will allow them to update it until it has been approved or disabled.
 * If their prior request was disabled they will then be able to submit a new request.
 */
const AccessRequestPage = () => {
  const keycloakWrapper = useKeycloakWrapper();
  const keycloak = keycloakWrapper.obj;
  const userInfo = keycloak?.userInfo as IUserInfo;
  const dispatch = useDispatch();
  const [alert, setAlert] = React.useState<ISnackbarState>({});

  useEffect(() => {
    dispatch(getCurrentAccessRequestAction());
  }, [dispatch]);

  const data = useSelector<RootState, IAccessRequestState>(
    state => state.accessRequest as IAccessRequestState,
  );

  const { getByType, getPublicByType } = useCodeLookups();
  const agencies = getByType(API.AGENCY_CODE_SET_NAME);
  const roles = getPublicByType(API.ROLE_CODE_SET_NAME);

  const accessRequest = data?.accessRequest;
  const initialValues: IAccessRequestForm = {
    id: accessRequest?.id ?? 0,
    userId: userInfo?.sub,
    user: {
      id: userInfo?.sub,
      username: userInfo?.username,
      displayName: userInfo?.name,
      firstName: userInfo?.firstName,
      lastName: userInfo?.lastName,
      email: userInfo?.email,
      position: accessRequest?.user?.position ?? userInfo?.position ?? '',
    },
    agencies: accessRequest?.agencies ?? [],
    status: accessRequest?.status || AccessRequestStatus.OnHold,
    roles: accessRequest?.roles ?? [],
    note: accessRequest?.note ?? '',
    agency: accessRequest?.agencies?.find(x => x).id,
    role: accessRequest?.roles?.find(x => x).id,
    rowVersion: accessRequest?.rowVersion,
  };

  const selectAgencies = agencies.map(c => mapLookupCode(c, initialValues.agency));
  const selectRoles = roles.map(c => mapLookupCode(c, initialValues.role));

  const checkAgencies = (
    <Select
      label="Agency"
      field="agency"
      required={true}
      options={selectAgencies}
      placeholder={initialValues?.agencies?.length > 0 ? undefined : 'Please Select'}
    />
  );

  const checkRoles = (
    <Form.Group className="check-roles">
      <Form.Label>
        Roles{' '}
        <a target="_blank" rel="noopener noreferrer" href={AUTHORIZATION_URL}>
          Role Descriptions
        </a>
      </Form.Label>
      <TooltipWrapper
        toolTipId="select-roles-tip"
        toolTip="To select multiple roles, hold Ctrl and select options."
      >
        <Select
          field="role"
          required={true}
          options={selectRoles}
          placeholder={initialValues?.roles?.length > 0 ? undefined : 'Please Select'}
        />
      </TooltipWrapper>
    </Form.Group>
  );

  const button = initialValues.id === 0 ? 'Submit' : 'Update';
  const inProgress = React.useMemo(
    () =>
      initialValues.id !== 0 ? (
        <Alert key={initialValues.id} variant="primary">
          You will receive an email when your request is reviewed.
        </Alert>
      ) : null,
    [initialValues.id],
  );

  return (
    <div className="accessRequestPage">
      <div>
        <h3>Access Request</h3>
      </div>
      <hr />
      <Container fluid={true}>
        <Row className="justify-content-md-center">
          <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            validationSchema={AccessRequestSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await dispatch(getSubmitAccessRequestAction(toAccessRequest(values)));
                setAlert({
                  variant: 'success',
                  message: 'Your request has been submitted.',
                  show: true,
                });
              } catch (error) {
                setAlert({
                  variant: 'danger',
                  message: 'Failed to submit your access request.',
                  show: true,
                });
              }
              setSubmitting(false);
            }}
          >
            {props => (
              <Form className="userInfo">
                {inProgress}

                <Input
                  label="IDIR/BCeID"
                  field="user.username"
                  placeholder={initialValues.user.username}
                  readOnly={true}
                  type="text"
                />

                <Row>
                  <Col>
                    <Input
                      label="First Name"
                      field="user.firstName"
                      placeholder={initialValues.user.firstName}
                      readOnly={true}
                      type="text"
                    />
                  </Col>
                  <Col>
                    <Input
                      label="Last Name"
                      field="user.lastName"
                      placeholder={initialValues.user.lastName}
                      readOnly={true}
                      type="text"
                    />
                  </Col>
                </Row>

                <Input
                  label="Email"
                  field="user.email"
                  placeholder={initialValues.user.email}
                  readOnly={true}
                  type="email"
                />

                {checkAgencies}

                <Input
                  label="Position"
                  field="user.position"
                  placeholder="e.g) Director, Real Estate and Stakeholder Engagement"
                  type="text"
                />

                {checkRoles}

                <TextArea
                  label="Notes"
                  field="note"
                  placeholder="Please specify why you need access to PIMS and include your manager's name."
                  required={true}
                />

                <p>
                  By clicking request, you agree to our{' '}
                  <a href={DISCLAIMER_URL}>Terms and Conditions</a> and that you have read our{' '}
                  <a href={PRIVACY_POLICY_URL}>Privacy Policy</a>.
                </p>
                {alert.show && (
                  <Snackbar
                    show={alert.show}
                    message={alert.message}
                    variant={alert.variant}
                    onClose={() => setAlert({})}
                  />
                )}
                <Row className="justify-content-md-center">
                  <ButtonToolbar className="cancelSave">
                    <Button className="mr-5" type="submit">
                      {button}
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

export default AccessRequestPage;
