import { useFormikContext } from 'formik';
import React, { useEffect, useMemo, useState } from 'react';
import { Badge, Col, Row, Spinner } from 'react-bootstrap';
import { FaRegTrashAlt } from 'react-icons/fa';

import { Select, SelectOption } from './Select';

/**
 * @description This interface represents the props for the UserRoleSelector component.
 *
 * @author Zach Bourque
 * @interface
 */
interface IUserRoleSelector {
  options: string[];
  handleAddRole: (role: string) => void;
  handleDeleteRole: (role: string) => void;
}

/**
 * @description This interface represents the needed values for the UserRoleSelector component from the useFormikContext cook.
 *
 * @author Zach Bourque
 * @interface
 */
interface UserRoleSelectorFormikValues {
  goldRoles: string[];
  username: string;
  rolesToRemove: string[];
  rolesToAdd: string[];
}

/**
 * @description This component renders input for, and displaying of Keycloak Gold Roles
 *
 * @author Zach Bourque
 * @param {IUserRoleSelector} props - The props for the component
 * @param {string[]} props.options - An array of strings representing the available options for roles.
 * @param {Function} props.handleAddRole - A callback function that is called when a user clicks the "Add" button. It is passed the role that was added as a string.
 * @param {Function} props.handleDeleteRole - A callback function that is called when a user clicks the "Delete" button. It is passed the role that was deleted as a string.
 *
 * @example
 * <UserRoleSelector options={["Admin", "SRES"]} />
 */
const UserRoleSelector = ({ options, handleAddRole, handleDeleteRole }: IUserRoleSelector) => {
  const { setFieldValue } = useFormikContext();
  const { values } = useFormikContext<UserRoleSelectorFormikValues>();
  // State to manage the current user's roles
  const [roles, setRoles] = useState<string[]>(values.goldRoles ?? []);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUnableToLoadRoles, setIsUnableToLoadRoles] = useState<boolean>(false);

  // Roles that the user does not already have.
  const roleOptions = useMemo(() => {
    return roles !== undefined
      ? options
          .map((r) => ({ label: r, value: r }) as SelectOption)
          .filter((r) => !roles.includes(r.value.toString()))
      : [];
  }, [roles, options]);

  // Once the component has been populated with data, disable loading.
  useEffect(() => {
    if (values.username) {
      setRoles(values.goldRoles ?? []);
      setIsUnableToLoadRoles(!values.goldRoles);
      setIsLoading(false);
    }
  }, [values.username]);

  useEffect(() => {
    // Update formik values goldRoles of parent component EditUserPage.
    setFieldValue('goldRoles', roles);
  }, [roles, setFieldValue]);

  /**
   * Handles the selection of a role from the dropdown.
   * Adds the role to the user's rolesToAdd state in the parent component,
   * and updates the state for the Select options.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event object triggered by the role selection.
   */
  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const roleName = e.target.value;
    if (!roleName || roleName === '') return;

    // Add role to parent component state in EditUserPage.
    handleAddRole(roleName);

    // Set state for Select options.
    setRoles((prevRoles) => {
      const newRoles = [...prevRoles, roleName];
      return newRoles;
    });
  };

  /**
   * Handles deleting a role from user's roles.
   * Adds the role to the user's rolesToRemove state in the parent component,
   * and updates the state for the Select options.
   * @param {string} roleName - The name of the role to be removed.
   */
  const handleDeleteClick = (roleName: string) => async () => {
    // Add role to parent component state in EditUserPage.
    handleDeleteRole(roleName);
    // Set state for Select options.
    setRoles((prev) => prev.filter((r) => r !== roleName));
  };

  return isUnableToLoadRoles ? (
    <p>Unable to load user's roles</p>
  ) : (
    <Row
      style={{
        ...(isLoading ? { pointerEvents: 'none', opacity: '0.4' } : {}),
        position: 'relative',
      }}
    >
      <Col>
        <Select
          style={{ marginLeft: '15px' }}
          field="Roles"
          options={roleOptions}
          onChange={handleSelect}
          placeholder="Add Roles..."
          label="Role Management"
        ></Select>
      </Col>
      <Col>
        {roles
          ? roles.map((r) => (
              <Badge key={r} bg="secondary" className="m-1">
                {r}
                <FaRegTrashAlt
                  size={15}
                  onClick={handleDeleteClick(r)}
                  className="m-1"
                  role="button"
                />
              </Badge>
            ))
          : options.map((r) => (
              <Badge key={r} bg="secondary" className="m-1">
                {r}
                <FaRegTrashAlt
                  size={15}
                  onClick={handleDeleteClick(r)}
                  className="m-1"
                  role="button"
                />
              </Badge>
            ))}
      </Col>
      <Row>
        <Col>
          {isLoading ? (
            <Spinner
              animation="border"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
              }}
            />
          ) : (
            ''
          )}
        </Col>
      </Row>
    </Row>
  );
};

export default UserRoleSelector;
