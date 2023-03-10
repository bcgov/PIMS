import { useFormikContext } from 'formik';
import React, { useEffect, useMemo, useState } from 'react';
import { Badge, Col, Row, Spinner } from 'react-bootstrap';
import { FaRegTrashAlt } from 'react-icons/fa';

import { Select, SelectOption } from './Select';

/**
 * @description This interface represents the props for the UserRoleSelector component.
 *
 * @author Zach Bourque <Zachary.Bourque@gov.bc.ca>
 * @interface
 */
interface IUserRoleSelector {
  options: string[];
  allUserRoles: string[];
  handleAddRole: (role: string) => void;
  handleDeleteRole: (role: string) => void;
}

/**
 * @description This interface represents the needed values for the UserRoleSelector component from the useFormikContext cook.
 *
 * @author Zach Bourque <Zachary.Bourque@gov.bc.ca>
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
 * @author Zach Bourque <Zachary.Bourque@gov.bc.ca>
 * @param {IUserRoleSelector} props - The props for the component
 * @param {string[]} props.options - The array of roles to give/remove from the user.
 *
 * @example
 * <UserRoleSelector options={["Admin", "SRES"]} />
 */
const UserRoleSelector = ({
  options,
  allUserRoles,
  handleAddRole,
  handleDeleteRole,
}: IUserRoleSelector) => {
  const { setFieldValue } = useFormikContext();
  let { values } = useFormikContext<UserRoleSelectorFormikValues>();
  // State to manage the current user's roles
  const [roles, setRoles] = useState<string[]>(values.goldRoles ?? []);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUnableToLoadRoles, setIsUnableToLoadRoles] = useState<boolean>(false);

  // Only allow the user to add roles that the user does not already have
  const roleOptions = useMemo(() => {
    return roles !== undefined
      ? options
          .map(r => ({ label: r, value: r } as SelectOption))
          .filter(r => !roles.includes(r.value.toString()))
      : [];
  }, [roles, options]);

  // Once the component has been populated with data, disable loading
  useEffect(() => {
    if (values.username) {
      setRoles(values.goldRoles ?? []);
      setIsUnableToLoadRoles(!values.goldRoles);
      setIsLoading(false);
    }
  }, [values.goldRoles, values.username]);

  useEffect(() => {
    setFieldValue('goldRoles', roles);
  }, [roles, setFieldValue]);

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    handleAddRole(e.target.value);
    setRoles(prevRoles => {
      const newRoles = [...prevRoles, e.target.value];
      return newRoles;
    });
  };

  const handleDeleteClick = (roleName: string) => async () => {
    handleDeleteRole(roleName);
    setRoles(prev => prev.filter(r => r !== roleName));
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
          ? roles.map(r => (
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
          : options.map(r => (
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
