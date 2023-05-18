import './EditUserPage.scss';

import { ILookupCode } from 'actions/ILookupCode';
import { Form, Input, Select, SelectOption } from 'components/common/form';
import UserRoleSelector from 'components/common/form/UserRoleSelector';
import { Label } from 'components/common/Label';
import TooltipWrapper from 'components/common/TooltipWrapper';
import * as API from 'constants/API';
import { Field, FieldArray, Formik } from 'formik';
import useCodeLookups from 'hooks/useLookupCodes';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Button, ButtonToolbar, Col, Container, Navbar, Row, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchUserDetail, getUpdateUserAction } from 'store/slices/hooks/usersActionCreator';
import { clearUser } from 'store/slices/userSlice';
import { formatApiDateTime } from 'utils';
import { UserUpdateSchema } from 'utils/YupSchema';

import useEditUserService from './useEditUserService';

interface IRole {
  name: string;
  id: string;
}

const EditUserPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { addRole, deleteRole } = useEditUserService();

  const { getByType } = useCodeLookups();
  const agencies = getByType(API.AGENCY_CODE_SET_NAME);
  const roles = getByType(API.ROLE_CODE_SET_NAME);

  useEffect(() => {
    return () => {
      // Clear user on component unmount.
      dispatch(clearUser());
    };
  }, []);

  // Fetch user details.
  const userId = params.id?.toString() ?? '';
  useEffect(() => {
    fetchUserDetail({ id: userId })(dispatch);
  }, [dispatch, userId]);

  // Redux state store.
  const user = useAppSelector((store) => store.users.user);
  const mapLookupCode = (code: ILookupCode): SelectOption => ({
    label: code.name,
    value: code.id.toString(),
    selected: !!user.roles.find((x) => x.id === code.id.toString()),
    parent: '',
  });
  const mapRoleLookupCodes = (code: ILookupCode) => ({
    name: code.name,
    id: code.id.toString(),
  });

  // Formik initialValues.
  const initialValues = {
    keycloakUserId: user.keycloakUserId,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    displayName: user.displayName,
    isDisabled: !!user.isDisabled,
    rowVersion: user.rowVersion,
    emailVerified: false,
    agencies: user.agencies,
    roles: user.roles.map((x) => x.id),
    goldRoles: user.goldUserRoles,
    note: user.note,
    agency: user.agencies && user.agencies.length !== 0 ? user.agencies[0].id : '',
    role: user.roles && user.roles.length !== 0 ? user.roles[0].id : '',
    position: user.position ?? '',
    lastLogin: formatApiDateTime(user.lastLogin),
  };

  // State.
  const [allUserRoles, setAllUserRoles] = useState<string[]>(initialValues.roles);
  const [rolesToAdd, setRolesToAdd] = useState<string[]>([]);
  const [rolesToRemove, setRolesToRemove] = useState<string[]>([]);
  const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false);
  const [loggedInSinceGold, setLoggedInSinceGold] = useState<boolean>(true);

  // Has the user logged in since gold changes.
  const hasLoggedInSinceGold = (lastLogin: string | undefined | null) => {
    if (!lastLogin) setLoggedInSinceGold(false);
    const lastLoginDate = moment(lastLogin);
    const keycloakGoldUpdateDate = moment('2023-02-15 16:20:00'); // Feb 15th 4:20pm 2023
    setLoggedInSinceGold(lastLoginDate.isSameOrAfter(keycloakGoldUpdateDate));
  };

  // Update if user has logged in since gold changes.
  useEffect(() => {
    hasLoggedInSinceGold(user.lastLogin);
  }, [user.lastLogin]);

  /**
   * This function takes in a role (as a string) and adds it to the user's roles.
   * It updates the state to reflect the change by adding the role to the allUserRoles and rolesToAdd arrays.
   * @param {string} role - The role to add to the user's roles.
   */
  const handleAddRole = (role: string) => {
    // If the role to add is in the roles to remove array, remove it from that array
    if (rolesToRemove.includes(role)) {
      setRolesToRemove(rolesToRemove.filter((r) => r !== role));
      // Add the role to the all user roles array
      setAllUserRoles([...allUserRoles, role]);
      return;
    }
    // Add the role to the all user roles array
    setAllUserRoles([...allUserRoles, role]);
    // Add the role to the roles to add array
    setRolesToAdd([...rolesToAdd, role]);
  };

  /**
   * This function takes in a role (as a string) and removes it from the user's roles.
   * It updates the state to reflect the change by removing the role from the allUserRoles array and adding it to the rolesToRemove array.
   * @param {string} role - The role to remove from the user's roles.
   */
  const handleDeleteRole = (role: string) => {
    // If the role to remove is in the roles to add array, remove it from that array
    if (rolesToAdd.includes(role)) {
      setRolesToAdd(rolesToAdd.filter((r) => r !== role));
      // Remove the role from the all user roles array
      setAllUserRoles(allUserRoles.filter((r) => r !== role));
      return;
    }
    // Remove the role from the all user roles array
    setAllUserRoles(allUserRoles.filter((r) => r !== role));
    // Add the role to the roles to remove array
    setRolesToRemove([...rolesToRemove, role]);
  };

  const goBack = () => {
    navigate('/admin/users');
  };

  let agenciesToUpdate: any[];
  const selectAgencies = agencies.map((c) => mapLookupCode(c));

  const updateAgenciesOnSubmit = (values: typeof initialValues) => {
    if (values.agency !== '') {
      agenciesToUpdate = [{ id: Number(values.agency) }];
    } else {
      agenciesToUpdate = user.agencies;
    }
  };

  // Add the selected roles to Keycloak when clicking save button.
  const addKeyCloakRolesOnSubmit = async (values: typeof initialValues) => {
    if (rolesToAdd.length >= 1) {
      await addRole(values.username, rolesToAdd);
      setRolesToAdd([]);
    }
  };

  // Remove the selected roles to Keycloak when clicking save button.
  const removeKeyCloakRolesOnSubmit = async (values: typeof initialValues) => {
    if (rolesToRemove.length >= 1) {
      await deleteRole(values.username, rolesToRemove);
      setRolesToRemove([]);
    }
  };

  // Get the roles from Keycloak as well as the role ids to save to the database.
  const formatUserRoles = (values: typeof initialValues) => {
    const allRoles: IRole[] = roles.map((r) => mapRoleLookupCodes(r));
    return allRoles.filter(function (role) {
      return values.goldRoles.some((goldRole) => {
        return goldRole === role.name;
      });
    });
  };

  /**
   * Handles the form submission when editing a user's roles in Keycloak and synchronizes the user roles in the database with the roles in Keycloak.
   * Adds any roles that were added and removes any roles that were deleted then updates the user in the database
   */
  const onSubmitUserChanges = async (values: typeof initialValues, setSubmitting: any) => {
    setIsSaveLoading(true);
    updateAgenciesOnSubmit(values);
    let userRolesWithIDs;
    if (values.goldRoles) {
      await addKeyCloakRolesOnSubmit(values);
      await removeKeyCloakRolesOnSubmit(values);
      userRolesWithIDs = formatUserRoles(values);
    }

    await getUpdateUserAction(
      { id: userId },
      {
        id: user.id,
        keycloakUserId: user.keycloakUserId,
        username: user.username,
        displayName: values.displayName,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        isDisabled: values.isDisabled,
        rowVersion: values.rowVersion,
        emailVerified: values.emailVerified,
        agencies: agenciesToUpdate,
        roles: userRolesWithIDs,
        position: values.position,
        note: values.note,
      },
    )(dispatch);
    setSubmitting(false);
    setIsSaveLoading(false);
  };

  return (
    <div>
      <Navbar className="navBar" expand="sm" variant="light" bg="light">
        <Navbar.Brand href="#" style={{ marginLeft: '10px' }}>
          User Information
        </Navbar.Brand>
      </Navbar>
      <Container fluid={true}>
        <Row className="user-edit-form-container">
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={UserUpdateSchema}
            onSubmit={async (values, { setSubmitting }) => {
              await onSubmitUserChanges(values, setSubmitting);
            }}
          >
            {(props) => (
              <Form className="userInfo">
                {loggedInSinceGold ? (
                  <>
                    <Label>Username</Label>
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

                    <Select
                      style={{ width: '450px', marginTop: '10px' }}
                      label="Agency"
                      field="agency"
                      data-testid="agency"
                      required={true}
                      options={selectAgencies}
                      placeholder={user?.agencies?.length > 0 ? undefined : 'Please Select'}
                    />

                    <Row style={{ marginTop: '10px' }}>
                      <Col>
                        <FieldArray name="roles">
                          {(arrayHelpers) => (
                            <UserRoleSelector
                              options={roles.map((r) => r.name)}
                              handleAddRole={(role) => {
                                arrayHelpers.push(role);
                                handleAddRole(role);
                              }}
                              handleDeleteRole={(role) => {
                                arrayHelpers.remove(allUserRoles.findIndex((r) => r === role));
                                handleDeleteRole(role);
                              }}
                            />
                          )}
                        </FieldArray>
                      </Col>
                    </Row>

                    <Label>Position</Label>
                    <Input
                      field="position"
                      placeholder="e.g) Director, Real Estate and Stakeholder Engagement"
                      type="text"
                      data-testid="position"
                    />

                    <Label>Notes</Label>
                    <Input
                      as="textarea"
                      field="note"
                      placeholder="A note about this user"
                      type="text"
                      data-testid="note"
                    />

                    <Form.Group className={'is-disabled'}>
                      <Form.Label>Disable Account?&nbsp;</Form.Label>
                      <TooltipWrapper
                        toolTipId="is-disabled-tooltip"
                        toolTip={'Click to change account status then click Save.'}
                      >
                        <Field data-testid="isDisabled" type="checkbox" name="isDisabled" />
                      </TooltipWrapper>
                    </Form.Group>
                  </>
                ) : (
                  <>
                    <br />
                    <p>User has not logged in since the upgrade from Keycloak Silver to Gold.</p>
                    <p>
                      Last login was: <b>{props.values.lastLogin}</b>
                    </p>
                    <p>User must log in before changes can be made!</p>
                  </>
                )}

                <Row className="justify-content-md-center">
                  <Col>
                    <ButtonToolbar className="cancelSave">
                      <Button
                        style={{ marginRight: '10px' }}
                        variant="secondary"
                        type="button"
                        onClick={goBack}
                        disabled={isSaveLoading}
                      >
                        Cancel
                      </Button>
                      {loggedInSinceGold && (
                        <Button disabled={isSaveLoading} type="submit">
                          Save
                        </Button>
                      )}
                    </ButtonToolbar>
                  </Col>
                  <Col>{isSaveLoading ? <Spinner animation="border" /> : ''}</Col>
                </Row>
                <hr></hr>
              </Form>
            )}
          </Formik>
        </Row>
      </Container>
    </div>
  );
};

export default EditUserPage;
