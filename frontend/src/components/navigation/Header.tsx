import { useKeycloak } from 'react-keycloak';
import React, { useEffect } from 'react';
import { Image, } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import * as Permission from "constants/permissions";
import { USER_ROLES } from "constants/environment";
import './Header.scss';
import logoUrl from './logo-banner.svg';
import logout from './logout.svg';

function Header() {
  const history = useHistory();
  const { keycloak } = useKeycloak();
  const isAdmin = keycloak?.realmAccess?.roles.includes(USER_ROLES[Permission.ADMIN]) == true;
  return (
    <header className="App-header">
      <div className="bar">
        <div className="banner">
          <a href="https://gov.bc.ca">
            <img
              src={logoUrl}
              width="156"
              height="43"
              alt="Go to the Government of British Columbia website"
            />
          </a>
          <h1 className="title">Property Inventory Management System</h1>
        </div>
        {!!keycloak.authenticated ? (<div className="other">
          <div className="exit" onClick={() => {
            history.push('/');
            keycloak.logout();
          }}>
            <Image src={logout} width="34" height="34" alt="exit"></Image>
            <p>Sign-out</p>
          </div>

        </div>) : (<span></span>)}
      </div>
    </header>
  );
}

export default Header;


