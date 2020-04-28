import React, { useEffect } from 'react';
import './AccessRequestPage.scss';
import { Container, Row, Col, ButtonToolbar, Button, Alert } from 'react-bootstrap';
import { IGenericNetworkAction } from 'actions/genericActions';
import { ILookupCode } from 'actions/lookupActions';
import {
  getCurrentAccessRequestAction,
  getSubmitAccessRequestAction,
  toAccessRequest,
} from 'actionCreators/accessRequestActionCreator';
import { IUserInfo, IAccessRequest } from 'interfaces';
import { Formik } from 'formik';
import { Form, Input, TextArea, Select } from '../components/common/form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { IAccessRequestState } from 'reducers/accessRequestReducer';
import { ILookupCodeState } from 'reducers/lookupCodeReducer';
import * as API from 'constants/API';
import * as actionTypes from 'constants/actionTypes';
import { DISCLAIMER_URL, PRIVACY_POLICY_URL } from 'constants/strings';
import _ from 'lodash';
import { AccessRequestSchema } from 'utils/YupSchema';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { mapLookupCode } from 'utils';

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

  useEffect(() => {
    dispatch(getCurrentAccessRequestAction());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = useSelector<RootState, IAccessRequestState>(
    state => state.accessRequest as IAccessRequestState,
  );
  const lookupCodes = useSelector<RootState, ILookupCode[]>(
    state => (state.lookupCode as ILookupCodeState).lookupCodes,
  );
  const request = useSelector<RootState, IGenericNetworkAction>(
    state => (state.network as any)[actionTypes.ADD_REQUEST_ACCESS] as IGenericNetworkAction,
  );
  const agencies = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.AGENCY_CODE_SET_NAME;
  });
  const roles = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.ROLE_CODE_SET_NAME;
  });

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
    isGranted: accessRequest?.isGranted ?? false,
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
    <Select
      label="Role"
      field="role"
      required={true}
      options={selectRoles}
      placeholder={initialValues?.roles?.length > 0 ? undefined : 'Please Select'}
    />
  );

  const button = initialValues.id === 0 ? 'Submit' : 'Update';
  const inProgress =
    initialValues.id !== 0 ? (
      <Alert key={initialValues.id} variant="primary">
        You will receive an email when your request is reviewed.
      </Alert>
    ) : null;
  const success =
    (!request?.isFetching && request?.status === 201) || request?.status === 200 ? (
      <Alert key={initialValues.id} variant="success">
        Your request has been submitted.
      </Alert>
    ) : null;

  return (
    <div>
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
            onSubmit={(values, { setSubmitting }) => {
              dispatch(getSubmitAccessRequestAction(toAccessRequest(values)));
              setSubmitting(false);
            }}
          >
            {props => (
              <Form className="userInfo">
                {success}

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
                  placeholder="Please specify why you need access to this site."
                />

                <p>
                  By clicking request, you agree to our{' '}
                  <a href={DISCLAIMER_URL}>Terms and Conditions</a> and that you have read our{' '}
                  <a href={PRIVACY_POLICY_URL}>Privacy Policy</a>.
                </p>

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
