import { useKeycloak } from 'react-keycloak';
import React from 'react';
import { Image, } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import './Header.scss';
import logoUrl from './logo-banner.svg';
import logout from './logout.svg';

function Header() {
  const history = useHistory();
  const { keycloak } = useKeycloak();
  //example of how to check role: const isAdmin = keycloak?.realmAccess?.roles.includes(USER_ROLES[Permission.ADMIN]) == true;
  return (
    <header className="App-header">
      <div className="bar">
        <div className="banner">
          <a href="https://gov.bc.ca" className="bc-gov-icon">
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


