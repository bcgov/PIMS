import React from 'react';
import renderer from 'react-test-renderer';
import { BuildingPopupView } from './BuildingPopupView';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { IAddress, IBuilding } from 'actions/parcelsActions';
import { useKeycloak } from '@react-keycloak/web';
import { render, cleanup } from '@testing-library/react';
import Claims from 'constants/claims';

jest.mock('@react-keycloak/web');
(useKeycloak as jest.Mock).mockReturnValue({
  keycloak: {
    userInfo: {
      agencies: [1],
    },
    subject: 'test',
  },
});

const history = createMemoryHistory();

const mockBuilding = (agencyId: number) => {
  var building: IBuilding = {
    id: 1,
    parcelId: 1,
    name: 'test name',
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
    buildingPredominateUseId: 0,
    buildingOccupantTypeId: 1,
    classification: 'test',
    classificationId: 2,
    occupantName: 'Mock Occupant',
    transferLeaseOnSale: true,
    buildingTenancy: 'string',
    rentableArea: 1,
    agencyId: agencyId,
    agency: 'agency',
    agencyCode: 'agency code',
    evaluations: [],
    fiscals: [
      {
        fiscalYear: 2020,
        key: 'Key',
        value: 2,
      },
    ],
  };
  return building;
};
describe('building popup view', () => {
  afterEach(() => {
    cleanup();
  });
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <Router history={history}>
          <BuildingPopupView building={mockBuilding(1)} />
        </Router>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('displays update option when user belongs to buildings agency', () => {
    const { getByText } = render(
      <Router history={history}>
        <BuildingPopupView building={mockBuilding(1)} />
      </Router>,
    );
    expect(getByText(/Update/i)).toBeInTheDocument();
  });

  it('displays view option', () => {
    const { getByText } = render(
      <Router history={history}>
        <BuildingPopupView building={mockBuilding(2)} />
      </Router>,
    );
    expect(getByText(/View/i)).toBeInTheDocument();
  });

  it('always displays update option for SRES', () => {
    (useKeycloak as jest.Mock).mockReturnValue({
      keycloak: {
        userInfo: {
          agencies: [1],
          roles: [Claims.ADMIN_PROPERTIES],
        },
        subject: 'test',
      },
    });
    const { getByText } = render(
      <Router history={history}>
        <BuildingPopupView building={mockBuilding(2)} />
      </Router>,
    );
    expect(getByText(/Update/i)).toBeInTheDocument();
  });
});
