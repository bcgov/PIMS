import React, { useEffect } from 'react';
import {
  Navbar,
  Container,
  Row,
  Col,
  InputGroup,
  FormControl,
  ButtonToolbar,
  Button,
} from 'react-bootstrap';
import { Form, Input, Select, SelectOption } from '../components/common/form';
import { fetchUserDetail, getUpdateUserAction } from 'actionCreators/usersActionCreator';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { IUserDetails } from 'interfaces';
import _ from 'lodash';
import { Formik } from 'formik';
import { UserUpdateSchema } from 'utils/YupSchema';
import { IUserDetailParams } from 'constants/API';
import { ILookupCodeState } from 'reducers/lookupCodeReducer';
import { ILookupCode } from 'actions/lookupActions';
import * as API from 'constants/API';
import './EditUserPage.scss';
import { Label } from 'components/common/Label';

interface IEditUserPageProps extends IUserDetailParams {
  match?: any;
}

const EditUserPage = (props: IEditUserPageProps) => {
  const userId = props?.match?.params?.id || props.id;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserDetail({ id: userId }));
  }, [dispatch, userId]);

  const lookupCodes = useSelector<RootState, ILookupCode[]>(
    state => (state.lookupCode as ILookupCodeState).lookupCodes,
  );

  const agencies = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.AGENCY_CODE_SET_NAME;
  });
  const roles = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.ROLE_CODE_SET_NAME;
  });

  const user = useSelector<RootState, IUserDetails>(state => state.GET_USER_DETAIL as IUserDetails);

  const mapLookupCode = (code: ILookupCode): SelectOption => ({
    label: code.name,
    value: code.id.toString(),
  });

  const selectAgencies = agencies.map(c => mapLookupCode(c));
  const selectRoles = roles.map(c => mapLookupCode(c));

  // Arrays below are used to add the role/agency from the dropdown later in code
  let agenciesToUpdate: any[];
  let rolesToUpdate: any[];

  const checkAgencies = (
    <Select
      label="Agency"
      field="agency"
      required={true}
      options={selectAgencies}
      placeholder={user?.agencies?.length > 0 ? undefined : 'Please Select'}
    />
  );

  const checkRoles = (
    <Select
      label="Role"
      field="role"
      required={true}
      options={selectRoles}
      placeholder={user?.roles?.length > 0 ? undefined : 'Please Select'}
    />
  );

  const initialValues = {
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    displayName: user.displayName,
    isDisabled: !!user.isDisabled,
    rowVersion: user.rowVersion,
    emailVerified: false,
    agencies: user.agencies,
    roles: user.roles,
    note: user.note,
    agency: user.agencies && user.agencies.length !== 0 ? user.agencies[0].id : '',
    role: user.roles && user.roles.length !== 0 ? user.roles[0].id : '',
    position: user.position,
  };

  return (
    <div>
      <Navbar className="navBar" expand="sm" variant="light" bg="light">
        <Navbar.Brand href="#">User Information</Navbar.Brand>
      </Navbar>
      <Container fluid={true}>
        <Row className="justify-content-md-center">
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={UserUpdateSchema}
            onSubmit={(values, { setSubmitting }) => {
              if (values.agency !== '') {
                agenciesToUpdate = [{ id: Number(values.agency) }];
              } else {
                agenciesToUpdate = user.agencies;
              }

              if (values.role !== '') {
                rolesToUpdate = [{ id: values.role }];
              } else {
                rolesToUpdate = user.roles;
              }
              dispatch(
                getUpdateUserAction(
                  { id: userId },
                  {
                    id: user.id,
                    username: user.username,
                    displayName: values.displayName,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    isDisabled: values.isDisabled,
                    rowVersion: values.rowVersion,
                    emailVerified: values.emailVerified,
                    agencies: agenciesToUpdate,
                    roles: rolesToUpdate,
                    position: values.position,
                  },
                ),
              );
              setSubmitting(false);
            }}
          >
            {props => (
              <Form className="userInfo">
                <Label>IDIR/BCeID</Label>
                <Input field="username" value={props.values.username} readOnly={true} type="text" />

                <Row>
                  <Col>
                    <Label>First Name</Label>
                    <Input field="firstName" placeholder={props.values.firstName} type="text" />
                  </Col>
                  <Col>
                    <Label>Last Name</Label>
                    <Input field="lastName" placeholder={props.values.lastName} type="text" />
                  </Col>
                </Row>

                <Label>Email</Label>
                <Input field="email" placeholder={props.values.email} type="email" />

                {checkAgencies}

                <Label>Position</Label>
                <Input
                  field="position"
                  placeholder="e.g) Director, Real Estate and Stakeholder Engagement"
                  type="text"
                />

                {checkRoles}

                <Label>Notes</Label>
                <InputGroup className="notes">
                  <FormControl
                    as="textarea"
                    placeholder="Please specify why you need access to this site."
                  />
                </InputGroup>

                <InputGroup className="isDisabled">
                  <InputGroup.Prepend>
                    <InputGroup.Text>Would you like to disable this user?</InputGroup.Text>
                  </InputGroup.Prepend>
                  <InputGroup.Append>
                    <InputGroup.Checkbox
                      onClick={() => (props.values.isDisabled = true)}
                      name="isDisabled"
                    />
                  </InputGroup.Append>
                </InputGroup>

                <Label>Status</Label>
                <Select
                  field="status"
                  placeholder="Please Select"
                  options={[
                    { value: 0, label: 'Approved' },
                    { value: 1, label: 'Denied' },
                  ]}
                />

                <Row className="justify-content-md-center">
                  <ButtonToolbar className="cancelSave">
                    <Button className="mr-5" variant="outline-dark" type="reset">
                      Cancel
                    </Button>
                    <Button className="mr-5" type="submit">
                      Save
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

export default EditUserPage;
