import * as React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FormikLookupCodeDropdown } from 'components/common/LookupCodeDropdown';
import { ILookupCode } from 'actions/lookupActions';
import { getSubmitAccessRequestAction } from 'actionCreators/authActionCreator';
import { Formik, Form, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { ILookupCodeState } from 'reducers/lookupCodeReducer';
import * as Yup from 'yup';
import * as API from 'constants/API';
import _ from 'lodash';
import { IGenericNetworkAction } from 'actions/genericActions';

export interface AccessRequestFormValues {
  agencyId: number;
  roleId: number;
}

const GuestAccessPage = () => {
  const lookupCodes = useSelector<RootState, ILookupCode[]>(
    state => (state.lookupCode as ILookupCodeState).lookupCodes,
  );
  const requestAccess = useSelector<RootState, IGenericNetworkAction>(
    state => state.requestAccess as IGenericNetworkAction,
  );
  const agencies = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.AGENCY_CODE_SET_NAME;
  });
  const roles = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.ROLE_CODE_SET_NAME;
  });
  const dispatch = useDispatch();
  const toRequest = (values: any): API.IAccessRequest => {
    return { agencies: [{ id: values.agency }], roles: [{ id: values.role }] };
  };
  const AccessRequestSchema = Yup.object().shape({
    agency: Yup.number()
      .min(1, 'Invalid Agency')
      .required('Required')
      .nullable(),
    role: Yup.string()
      .required('Required')
      .nullable(),
  });

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
              agency: null,
              role: null,
            }}
            validationSchema={AccessRequestSchema}
            onSubmit={(values, { setSubmitting }) => {
              dispatch(getSubmitAccessRequestAction(toRequest(values)));
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
