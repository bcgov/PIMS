import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import API, { Place } from '../../utils/API';
import './EditPlaceForm.scss';
import warning from './warning.svg';

export interface EditPlaceFormProps {
  place?: Place;
  onSave?: () => void;
  onDelete?: () => void;
}

// pass in the currently selected pin props.
// props should include a callback to trigger get pins after the delete.
const EditPlaceForm: React.FC<EditPlaceFormProps> = ({ place, onSave, onDelete }) => {
  if (!place) {
    throw new Error('Place property is required.');
  }
  const [note, setNote] = useState(place?.note || '');
  const [show, setShow] = useState(false);

  const handleSubmit = async (evt: any) => {
    evt.preventDefault();
    place.note = note;
    await API.updatePlace(place);
    if (onSave) {
      onSave();
    }
  };

  const deletePin = async (evt: any) => {
    setShow(false);
    await API.deletePlace(place.id);
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <div className="edit-place">
      <h1>Notes:</h1>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Body>
          <img alt="warning" src={warning} width="43" height="43" />
          <p>Are you sure you want to permanently delete the location marker?</p>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            style={{ backgroundColor: 'grey' }}
            onClick={() => setShow(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" style={{ backgroundColor: 'red' }} onClick={deletePin}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <Form>
        <Form.Group controlId="note">
          <Form.Control
            as="textarea"
            rows="4"
            className="text_input"
            value={note}
            onChange={(evt: any) => setNote(evt.target.value)}
          />
        </Form.Group>
        <Button
          variant="secondary"
          className="btn-square"
          style={{ backgroundColor: 'red' }}
          onClick={() => setShow(true)}
        >
          Delete
        </Button>
        <Button variant="primary" className="BC-Gov-PrimaryButton" onClick={handleSubmit}>
          Save
        </Button>
      </Form>
    </div>
  );
};

export default EditPlaceForm;
