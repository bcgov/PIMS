import React from 'react';
import renderer from 'react-test-renderer';
import AddPlaceForm from './AddPlaceForm';
import { render, fireEvent, getByText } from '@testing-library/react';
import { CreatePlacePayload } from '../../utils/API';
import axios from 'axios';

jest.mock('axios');

export interface AddPlaceProps {
  place: CreatePlacePayload;
  onSave?: () => void;
}

const onSave = () => {
  axios.post('/api/fake');
}

const getDefaultPlace = (): CreatePlacePayload => {
  const payload: CreatePlacePayload = {
    latitude: 48.01,
    longitude: 47.02,
    note: 'test',
  };
  return payload
}

//snapshot test - quickly verify that the overall structure of the component has not changed.
it('renders correctly', () => {
  const place = getDefaultPlace();
  const addPlaceForm = renderer.create(
    <AddPlaceForm place={place}></AddPlaceForm>
  ).toJSON();
  expect(addPlaceForm).toMatchSnapshot();
});

//dom style tests.
it('renders notes correctly', () => {
  const place = getDefaultPlace();
  const { container } = render(
    <AddPlaceForm place={place} />
  );

  expect(container.querySelector('.text_input').value).toBe('test');
});

//mocked axios api tests.
it('does not make requests when place is invalid', () => {
  const place = getDefaultPlace();
  const { container } = render(
    <AddPlaceForm place={place} onSave={onSave} />
  );
  
  fireEvent(getByText(container, 'Submit'), new MouseEvent('click'));
  expect(axios.post).not.toHaveBeenCalled();
});