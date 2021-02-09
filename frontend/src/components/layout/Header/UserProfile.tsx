import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import React from 'react';
import { Image, NavDropdown } from 'react-bootstrap';
import { useConfiguration } from 'hooks/useConfiguration';
import profileUrl from 'assets/images/profile.svg';
import useCodeLookups from 'hooks/useLookupCodes';
import styled from 'styled-components';
import { FaSignOutAlt } from 'react-icons/fa';
import * as API from 'constants/API';
import { ILookupCode } from 'actions/lookupActions';
import variables from '_variables.module.scss';

/** the styling for the dropdown menu that appears after clicking the user's name */
const StyleDropDown = styled(NavDropdown)`
  font-size: 14px;
  .dropdown-menu {
    width: 300px;
    height: 150px;
  }
  .nav-link {
    color: #fff;
    padding: 1px;
  }
  .dropdown-item {
    background-color: ${variables.primaryLightColor};
    border-top: 2px solid ${variables.accentColor};
  }
`;

/** shaded box the users system roles will be displayed in */
const RolesBox = styled.div`
  background-color: ${variables.filterBackgroundColor};
  margin: 5px;
`;

/** the text contained in the logout footer  */
const LogoutText = styled.p`
  color: #fff;
  margin-top: 0.5rem;
  margin-left: 120px;
`;

/** the styling for the avatar next to user's name */
const ProfileAvatar = styled(Image)`
  height: 30px;
  width: 30px;
`;

/** the styling for the logout icon in the logout footer */
const LogoutButton = styled(FaSignOutAlt)`
  margin-bottom: 2px;
  margin-left: 5px;
`;

/** Component that allows the user to logout, and gives information on current user's agency/roles */
export const UserProfile: React.FC = () => {
  const keycloak = useKeycloakWrapper();
  const displayName =
    keycloak.displayName ??
    (!!keycloak.firstName && !!keycloak.lastName
      ? `${keycloak.firstName} ${keycloak.lastName}`
      : 'default');
  const configuration = useConfiguration();
  const lookupCodes = useCodeLookups();
  const agencyOptions = lookupCodes.getByType(API.AGENCY_CODE_SET_NAME);
  const roles = keycloak.roles.join(', ');

  return (
    <>
      <ProfileAvatar src={profileUrl} rounded />
      <StyleDropDown className="px-0" title={displayName} id="user-dropdown">
        <p style={{ margin: 5 }}>
          <b>
            {
              agencyOptions.find(
                (x: ILookupCode) => x.id.toString() === keycloak.agencyId?.toString(),
              )?.name
            }
          </b>
        </p>
        <RolesBox>
          <p style={{ margin: 5 }}>
            <b>
              System Role(s):
              <br />
            </b>
            {roles}
          </p>
        </RolesBox>
        <NavDropdown.Item
          onClick={() => {
            keycloak.obj!.logout({ redirectUri: `${configuration.baseUrl}/logout` });
          }}
        >
          <LogoutText>
            Log out of PIMS <LogoutButton />
          </LogoutText>
        </NavDropdown.Item>
      </StyleDropDown>
    </>
  );
};
