import React from 'react';
import renderer from 'react-test-renderer';
import { ParcelPopupView } from './ParcelPopupView';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

const history = createMemoryHistory();

const mockParcel = {
  id: 1,
  pid: '1',
  pin: '1',
  latitude: '1',
  longitude: '1',
  statusId: '1',
  propertyStatus: 'Test Property Status',
  municipality: 'Test Municipality',
  projectNumber: 'Test-Project-Number',
  classification: 'Test Classification',
  description: 'Test Description',
  landArea: '100',
  classificationId: 1,
  zoning: '',
  agencyId: '1',
  isSensitive: false,
  landLegalDescription: 'Test Land Legal Description',
  address: '1234 Test Addr',
  evaluations: [],
  buildings: [],
  fiscals: [
    {
      fiscalYear: 2020,
      key: 'Key',
      value: 'Value',
    },
  ],
  zoningPotential: '',
};

it('renders correctly', () => {
  const tree = renderer
    .create(
      <Router history={history}>
        <ParcelPopupView parcel={mockParcel} />
      </Router>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
