import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { CreatePlacePayload } from '../../utils/API';
import './AddPlaceForm.scss';

export interface AddPlaceProps {
  place: CreatePlacePayload;
  onSave?: () => void;
}

// pass in the currently selected pin props.
// props should include a callback to trigger get pins after the delete.
const AddPlaceForm: React.FC<AddPlaceProps> = ({ place, onSave }) => {
  if (!place) {
    throw new Error('Place property is required.');
  }
  const [note, setNote] = useState(place?.note || '');

  const handleSubmit = async (evt: any) => {
    evt.preventDefault();
    place.note = note;
    if (onSave) {
      onSave();
    }
  };

  return (
    <div className="add-place">
      <h1>Notes:</h1>
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
        <Button variant="primary" className="BC-Gov-PrimaryButton" onClick={handleSubmit}>
          Save
        </Button>
      </Form>
    </div>
  );
};

export default AddPlaceForm;
