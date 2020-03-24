import * as React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FormikLookupCodeDropdown } from 'components/common/LookupCodeDropdown';
import { ILookupCode } from 'actions/lookupActions';
import { IPagedItems } from 'actions/adminActions';
import { getSubmitAccessRequestAction, toAccessRequest } from 'actionCreators/usersActionCreator';
import { Formik, Form, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { ILookupCodeState } from 'reducers/lookupCodeReducer';
import * as API from 'constants/API';
import _ from 'lodash';
import { IGenericNetworkAction } from 'actions/genericActions';
import { AccessRequestSchema } from 'utils/YupSchema';

export interface AccessRequestFormValues {
  agencyId: number;
  roleId: number;
}

const GuestAccessPage = () => {
  const lookupCodes = useSelector<RootState, ILookupCode[]>(
    state => (state.lookupCode as ILookupCodeState).lookupCodes,
  );
  const requestAccess = useSelector<RootState, IGenericNetworkAction>(
    state => state.postRequestAccess as IGenericNetworkAction,
  );
  const agencies = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.AGENCY_CODE_SET_NAME;
  });
  const roles = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.ROLE_CODE_SET_NAME;
  });
  const dispatch = useDispatch();

  return (
    <Container fluid={true}>
      <Row>
        <Col>
          <h1>Welcome to PIMS!</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <Formik
            initialValues={{
              agency: undefined,
              role: undefined,
            }}
            validationSchema={AccessRequestSchema}
            onSubmit={(values, { setSubmitting }) => {
              dispatch(getSubmitAccessRequestAction(toAccessRequest(values)));
              setSubmitting(false);
            }}
          >
            {props => (
              <Form>
                <FormikLookupCodeDropdown<typeof props.initialValues>
                  name="agency"
                  defaultTitle="Request access to Agency: "
                  lookupCodes={agencies}
                  {...props}
                />
                <ErrorMessage component="span" name="agency" className="error" />
                <FormikLookupCodeDropdown<typeof props.initialValues>
                  name="role"
                  defaultTitle="Request access to Role: "
                  lookupCodes={roles}
                  {...props}
                />
                <ErrorMessage component="span" name="role" className="error" />
                <div>
                  <button type="submit">Submit</button>
                </div>
                {requestAccess.status === 200 && !requestAccess.isFetching ? (
                  <p>Your request has been submitted</p>
                ) : null}
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};

export default GuestAccessPage;
