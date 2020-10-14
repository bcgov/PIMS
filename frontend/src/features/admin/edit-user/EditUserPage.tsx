import React, { useEffect } from 'react';
import { Navbar, Container, Row, Col, ButtonToolbar, Button } from 'react-bootstrap';
import { Form, Input, Select, SelectOption } from '../../../components/common/form';
import { fetchUserDetail, getUpdateUserAction } from 'actionCreators/usersActionCreator';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { IUserDetails } from 'interfaces';
import { Formik, Field } from 'formik';
import { UserUpdateSchema } from 'utils/YupSchema';
import { IUserDetailParams } from 'constants/API';
import * as API from 'constants/API';
import './EditUserPage.scss';
import { Label } from 'components/common/Label';
import { useHistory } from 'react-router-dom';
import TooltipIcon from 'components/common/TooltipIcon';
import { formatApiDateTime } from 'utils';
import useCodeLookups from 'hooks/useLookupCodes';
import { ILookupCode } from 'actions/lookupActions';

interface IEditUserPageProps extends IUserDetailParams {
  match?: any;
}

const EditUserPage = (props: IEditUserPageProps) => {
  const userId = props?.match?.params?.id || props.id;
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserDetail({ id: userId }));
  }, [dispatch, userId]);

  const { getByType } = useCodeLookups();
  const agencies = getByType(API.AGENCY_CODE_SET_NAME);
  const roles = getByType(API.ROLE_CODE_SET_NAME);

  const user = useSelector<RootState, IUserDetails>(state => state.GET_USER_DETAIL as IUserDetails);
  const mapLookupCode = (code: ILookupCode): SelectOption => ({
    label: code.name,
    value: code.id.toString(),
    selected: !!user.roles.find(x => x.id === code.id.toString()),
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
      data-testid="agency"
      required={true}
      options={selectAgencies}
      placeholder={user?.agencies?.length > 0 ? undefined : 'Please Select'}
    />
  );

  const checkRoles = (
    <Select
      label="Roles"
      field="roles"
      data-testid="role"
      multiple={true}
      required={true}
      options={selectRoles}
      placeholder={user?.roles?.length > 0 ? undefined : 'Please Select'}
    />
  );

  const goBack = () => {
    history.goBack();
  };

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
    roles: user.roles.map(x => x.id),
    note: user.note,
    agency: user.agencies && user.agencies.length !== 0 ? user.agencies[0].id : '',
    role: user.roles && user.roles.length !== 0 ? user.roles[0].id : '',
    position: user.position,
    lastLogin: formatApiDateTime(user.lastLogin),
  };

  return (
    <div>
      <Navbar className="navBar" expand="sm" variant="light" bg="light">
        <Navbar.Brand href="#">User Information</Navbar.Brand>
      </Navbar>
      <Container fluid={true}>
        <Row className="user-edit-form-container">
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

              if (values.roles) {
                rolesToUpdate = values.roles.map(r => ({ id: r }));
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
                    note: values.note,
                  },
                ),
              );
              setSubmitting(false);
            }}
          >
            {props => (
              <Form className="userInfo">
                <Label>IDIR/BCeID</Label>
                <Input
                  data-testid="username"
                  field="username"
                  value={props.values.username}
                  readOnly={true}
                  type="text"
                />
                <Label>Last Login</Label>
                <Input
                  data-testid="lastLogin"
                  field="lastLogin"
                  value={props.values.lastLogin}
                  readOnly={true}
                  type="text"
                />

                <Row>
                  <Col>
                    <Label>First Name</Label>
                    <Input
                      data-testid="firstName"
                      field="firstName"
                      placeholder={props.values.firstName}
                      type="text"
                    />
                  </Col>
                  <Col>
                    <Label>Last Name</Label>
                    <Input
                      data-testid="lastName"
                      field="lastName"
                      placeholder={props.values.lastName}
                      type="text"
                    />
                  </Col>
                </Row>

                <Label>Email</Label>
                <Input
                  data-testid="email"
                  field="email"
                  placeholder={props.values.email}
                  type="email"
                />

                {checkAgencies}

                <Label>Position</Label>
                <Input
                  field="position"
                  placeholder="e.g) Director, Real Estate and Stakeholder Engagement"
                  type="text"
                  data-testid="position"
                />

                {checkRoles}

                <Label>Note</Label>
                <Input
                  as="textarea"
                  field="note"
                  placeholder="A note about this user"
                  type="text"
                  data-testid="note"
                />

                <Form.Group className={'is-disabled'}>
                  <Form.Label>
                    Is Disabled?{' '}
                    <TooltipIcon
                      toolTipId="is-disabled-tooltip"
                      toolTip={'Toggle to change account status and click save.'}
                    />{' '}
                  </Form.Label>
                  <Field data-testid="isDisabled" type="checkbox" name="isDisabled" />
                </Form.Group>

                <Row className="justify-content-md-center">
                  <ButtonToolbar className="cancelSave">
                    <Button className="mr-5" variant="outline-dark" type="button" onClick={goBack}>
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
