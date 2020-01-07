import { useKeycloak } from 'react-keycloak';
import React, { useState, useEffect } from 'react';
import { Image, DropdownButton, Dropdown } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import './Header.scss';
import logoUrl from './logo-banner.svg';
import profileUrl from './profile.svg';
import logout from './logout.svg';
import dropdown from './dropdown.svg';
import API from '../../utils/API';

function Header(props) {
  const history = useHistory();
  const [isAdmin, setAdmin] = useState(false);
  const [activeUser, setActiveUser] = useState({ id: "" });
  const [users, setUsers] = useState([]);
  const { keycloak } = useKeycloak();
  useEffect(() => {
    async function fetchData() {
      if (keycloak.authenticated) {
        API.token = keycloak.token
        if (keycloak && keycloak.realmAccess && keycloak.realmAccess.roles) {
          const isAdmin = keycloak.realmAccess.roles.indexOf("administrator") >= 0;
          setAdmin(isAdmin);
          if (isAdmin) {
            const allUsers = await API.getAllUsers();
            if (allUsers) {
              allUsers.push({ firstName: "All", lastName: "Users", id: "all" });
            }
            setUsers(allUsers);
            props.setActiveUserId(keycloak.subject);
          }
        }

        keycloak.loadUserInfo().then(() => {
          //for simplicity just map the keycloak user details
          setActiveUser({ id: keycloak.subject, firstName: keycloak.userInfo.given_name, lastName: keycloak.userInfo.family_name});
        });
      }
    }
    fetchData();
  }, [keycloak]);

  const selectUser = (eventKey, event) => {
    const matchingUser = users.find(user => user.id === eventKey);
    if (!matchingUser) {
      throw Error("clicked on user not in user list.");
    }
    setActiveUser(matchingUser);
    props.setActiveUserId(matchingUser.id);
  }

  return (
    <div className="Logout">
      <div className="banner">
        <a href="https://gov.bc.ca" alt="British Columbia">
          <img
            src={logoUrl}
            width="156"
            height="43"
            alt="Go to the Government of British Columbia website"
          />
        </a>
        <h1>Geo-spatial Real Estate Inventory</h1>
      </div>
      {!!keycloak.authenticated ? (<div className="other">
        {!!isAdmin ? (<DropdownButton title={<span><img
          src={dropdown}
          width="49"
          height="49"
          alt="map pin"
        />Filter</span>} variant="filter" id="user-list-dropdown">
          {users.map((item, idx) => (
            <Dropdown.Item eventKey={item.id} key={idx} active={item.id === activeUser.id} onSelect={selectUser}>{item.firstName} {item.lastName}</Dropdown.Item>
          ))}
        </DropdownButton>) : <span></span>}

        <h2><img
          src={profileUrl}
          width="42"
          height="42"
          alt="profile"
        />{activeUser.firstName} {activeUser.lastName}
        </h2>
        <div className="exit" onClick={() => {
          history.push('/');
          keycloak.logout();
        }}>
          <Image src={logout} width="34" height="34" alt="exit"></Image>
          <p>Sign-out</p>
        </div>

      </div>) : (<span></span>)}
    </div>
  );
}

export default Header;


