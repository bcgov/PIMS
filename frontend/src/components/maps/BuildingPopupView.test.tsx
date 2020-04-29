import React from 'react';
import renderer from 'react-test-renderer';
import { BuildingPopupView } from './BuildingPopupView';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { IAddress } from 'actions/parcelsActions';
import { useKeycloak } from '@react-keycloak/web';
import { render } from '@testing-library/react';

jest.mock('@react-keycloak/web');
(useKeycloak as jest.Mock).mockReturnValue({
  keycloak: {
    userInfo: {
      agencies: ['1'],
    },
    subject: 'test',
  },
});

const history = createMemoryHistory();

const mockBuilding = (agencyId: string) => {
  var building = {
    id: 1,
    parcelId: 1,
    localId: 'string',
    description: 'Test description',
    address: ([
      {
        line1: '1234 Mock Street',
        cityId: 1,
        provinceId: 'BC',
        postal: 'V0S1N0',
      },
    ] as unknown) as IAddress,
    latitude: 50,
    longitude: 50,
    buildingFloorCount: 3,
    buildingConstructionTypeId: 1,
    buildingPredominateUseId: 'test',
    buildingOccupantTypeId: 1,
    occupantName: 'Mock Occupant',
    transferLeaseOnSale: true,
    buildingTenancy: 'string',
    rentableArea: '1',
    agencyId: agencyId,
    evaluations: [],
    fiscals: [
      {
        fiscalYear: 2020,
        key: 'Key',
        value: 'Value',
      },
    ],
  };
  return building;
};

it('renders correctly', () => {
  const tree = renderer
    .create(
      <Router history={history}>
        <BuildingPopupView building={mockBuilding('1')} />
      </Router>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('displays update option when user belongs to buildings agency', () => {
  const { getByText } = render(
    <Router history={history}>
      <BuildingPopupView building={mockBuilding('1')} />
    </Router>,
  );
  expect(getByText(/Update/i));
});

it('displays view option', () => {
  const { getByText } = render(
    <Router history={history}>
      <BuildingPopupView building={mockBuilding('2')} />
    </Router>,
  );
  expect(getByText(/View/i));
});
