import React, { useEffect } from 'react';
import { Container, Row, Col, Spinner, ButtonGroup, Button } from 'react-bootstrap';
import { getAccessRequestsAction } from 'actionCreators/usersActionCreator';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { IAccessRequest } from 'actions/adminActions';
import { IAccessRequestState } from 'reducers/accessRequestReducer';
import { toApiPaginateParams } from 'utils/CommonFunctions';
import { IGenericNetworkAction } from 'actions/genericActions';
import { Formik, ErrorMessage, Form } from 'formik';
import { FormikLookupCodeDropdown } from 'components/common/LookupCodeDropdown';
import * as Schema from 'components/common/FormSchema';
import * as API from 'constants/API';
import { ILookupCode } from 'actions/lookupActions';
import { ILookupCodeState } from 'reducers/lookupCodeReducer';
import _ from 'lodash';
import WrappedPaginate from 'components/common/WrappedPaginate';

const ManageAccessRequests = () => {
  const dispatch = useDispatch();
  const MAX_ACCESS_RESULTS_PER_PAGE = 5;
  const pagedAccessRequests = useSelector<RootState, IAccessRequest>(
    state => (state.accessRequest as IAccessRequestState).pagedAccessRequests,
  );
  const requestAccess = useSelector<RootState, IGenericNetworkAction>(
    state => state.accessRequest as IGenericNetworkAction,
  );
  const lookupCodes = useSelector<RootState, ILookupCode[]>(
    state => (state.lookupCode as ILookupCodeState).lookupCodes,
  );
  const agencies = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.AGENCY_CODE_SET_NAME;
  });
  const roles = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.ROLE_CODE_SET_NAME;
  });
  useEffect(() => {
    dispatch(getAccessRequestsAction(toApiPaginateParams(0, MAX_ACCESS_RESULTS_PER_PAGE)));
  }, []);

  return !requestAccess.isFetching ? (
    <Container fluid={true}>
      <Row>
        <Col>
          <h2>Manage Users</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          {pagedAccessRequests?.items?.length ? (
            <div className="bootstrap-table">
              <Row className="thead">
                <Col>User</Col>
                <Col>Agency</Col>
                <Col>Role</Col>
                <Col>Actions</Col>
              </Row>
              {pagedAccessRequests?.items.map((accessRequest: any) => {
                if (!accessRequest?.agencies?.length) {
                  accessRequest.agencies = [{}];
                }
                if (!accessRequest?.roles?.length) {
                  accessRequest.roles = [{}];
                }
                return (
                  <Formik
                    initialValues={{
                      agency: accessRequest?.agencies[0]?.id,
                      role: accessRequest?.roles[0]?.id,
                    }}
                    validationSchema={Schema.roleAgency}
                    onSubmit={(values, { setSubmitting }) => {
                      //TODO: the api for this doesn't exist yet.
                      setSubmitting(false);
                    }}
                  >
                    {props => (
                      <Form>
                        <Row key={accessRequest?.id}>
                          <Col>{accessRequest?.user?.displayName}</Col>
                          <Col>
                            <FormikLookupCodeDropdown<typeof props.initialValues>
                              name="agency"
                              {...props}
                              lookupCodes={agencies}
                              defaultTitle="No Agency Requested"
                              defaultValue={accessRequest?.agencies[0]?.id}
                            />
                            <ErrorMessage component="span" name="agency" className="error" />
                          </Col>
                          <Col>
                            <FormikLookupCodeDropdown<typeof props.initialValues>
                              name="role"
                              {...props}
                              lookupCodes={roles}
                              defaultTitle="No Role Requested"
                              defaultValue={accessRequest?.roles[0]?.id}
                            />
                            <ErrorMessage component="span" name="role" className="error" />
                          </Col>
                          <Col>
                            <ButtonGroup>
                              <Button variant="success" type="submit">
                                Approve
                              </Button>
                              <Button variant="danger" type="submit">
                                Deny
                              </Button>
                            </ButtonGroup>
                          </Col>
                        </Row>
                      </Form>
                    )}
                  </Formik>
                );
              })}
            </div>
          ) : null}
        </Col>
      </Row>
      <Row>
        <Col>
          <WrappedPaginate
            onPageChange={(page: any) => {
              dispatch(
                getAccessRequestsAction(
                  toApiPaginateParams(page.selected, MAX_ACCESS_RESULTS_PER_PAGE),
                ),
              );
            }}
            {...pagedAccessRequests}
          />
        </Col>
      </Row>
    </Container>
  ) : (
    <Spinner animation="border"></Spinner>
  );
};

export default ManageAccessRequests;
