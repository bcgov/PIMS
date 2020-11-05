import { IAccessRequestModel } from '../interfaces';
import { Container, Modal, Button, Form, Row, Col } from 'react-bootstrap';
import React from 'react';

interface IProps {
  request: IAccessRequestModel;
  onClose: () => void;
}
export const AccessRequestDetails: React.FC<IProps> = ({ request, onClose }) => {
  return (
    <Container>
      <Modal show={!!request} onHide={onClose}>
        <Modal.Header>
          <Modal.Title>Access Request Details</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ maxHeight: '500px' }}>
          <Form>
            <Form.Group as={Row} controlId="username">
              <Form.Label column sm="4">
                IDIR/BCeID:
              </Form.Label>
              <Col sm="8">
                <Form.Control disabled defaultValue={request.username} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="emailAddress">
              <Form.Label column sm="4">
                Email:
              </Form.Label>
              <Col sm="8">
                <Form.Control disabled defaultValue={request.email} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="firstName">
              <Form.Label column sm="4">
                First name:
              </Form.Label>
              <Col sm="8">
                <Form.Control disabled defaultValue={request.firstName} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="lastName">
              <Form.Label column sm="4">
                Last name:
              </Form.Label>
              <Col sm="8">
                <Form.Control disabled defaultValue={request.lastName} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="position">
              <Form.Label column sm="4">
                Position:
              </Form.Label>
              <Col sm="8">
                <Form.Control disabled defaultValue={request.position} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="agency">
              <Form.Label column sm="4">
                Agency:
              </Form.Label>
              <Col sm="8">
                <Form.Control disabled defaultValue={request.agency} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="role">
              <Form.Label column sm="4">
                Role:
              </Form.Label>
              <Col sm="8">
                <Form.Control disabled defaultValue={request.role} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="note">
              <Form.Label column sm="4">
                Note:
              </Form.Label>
              <Col sm="8">
                <Form.Control as="textarea" disabled defaultValue={request.note} />
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
