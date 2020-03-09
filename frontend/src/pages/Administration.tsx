import * as React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { useHistory, useRouteMatch, Switch, Route } from 'react-router-dom';
import ManageUsers from './ManageUsers';
import ManageAccessRequests from './ManageAccessRequests';

const Administration = () => {
  const history = useHistory();
  let { path, url } = useRouteMatch();
  const handleSelect = (eventKey: string) => history.push(`${url}/${eventKey}`);

  React.useEffect(() => {
    handleSelect('users');
  }, []);

  return (
    <Container fluid={true}>
      <Row>
        <Col>
          <h1>Administrator Dashboard</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <Nav variant="tabs" defaultActiveKey="/home" onSelect={handleSelect}>
            <Nav.Item>
              <Nav.Link eventKey="users">Manage Users</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="requests">Manage Access Requests</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>
      <Row>
        <Col>
          <Switch>
            <Route path={`${path}/users`} component={ManageUsers}></Route>
            <Route path={`${path}/requests`} component={ManageAccessRequests}></Route>
          </Switch>
        </Col>
      </Row>
    </Container>
  );
};

export default Administration;
