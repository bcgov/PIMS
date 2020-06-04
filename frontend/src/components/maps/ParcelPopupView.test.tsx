import React from 'react';
import renderer from 'react-test-renderer';
import { ParcelPopupView } from './ParcelPopupView';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';
import { useKeycloak } from '@react-keycloak/web';
import { IAddress, IParcel } from 'actions/parcelsActions';
import { Claims } from 'constants/claims';

const history = createMemoryHistory();

jest.mock('@react-keycloak/web');
(useKeycloak as jest.Mock).mockReturnValue({
  keycloak: {
    userInfo: {
      agencies: [1],
    },
    subject: 'test',
  },
});

const mockParcel = (agencyId: number) => {
  var parcel: IParcel = {
    id: 1,
    pid: '1',
    pin: 1,
    latitude: 1,
    longitude: 1,
    statusId: 1,
    propertyStatus: 'Test Property Status',
    municipality: 'Test Municipality',
    projectNumber: 'Test-Project-Number',
    classification: 'Test Classification',
    description: 'Test Description',
    landArea: 100,
    classificationId: 1,
    zoning: '',
    agencyId: agencyId,
    isSensitive: false,
    landLegalDescription: 'Test Land Legal Description',
    address: ([
      {
        line1: '1234 Mock Street',
        cityId: 1,
        provinceId: 'BC',
        postal: 'V0S1N0',
      },
    ] as unknown) as IAddress,
    evaluations: [],
    buildings: [],
    fiscals: [
      {
        fiscalYear: 2020,
        key: 'Key',
        value: 2,
      },
    ],
    zoningPotential: '',
  };
  return parcel;
};

it('renders correctly', () => {
  const tree = renderer
    .create(
      <Router history={history}>
        <ParcelPopupView parcel={mockParcel(1)} />
      </Router>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('displays update option when user belongs to buildings agency', () => {
  const { getByText } = render(
    <Router history={history}>
      <ParcelPopupView parcel={mockParcel(1)} />
    </Router>,
  );
  expect(getByText(/Update/i)).toBeInTheDocument();
});

it('displays view option', () => {
  const { getByText } = render(
    <Router history={history}>
      <ParcelPopupView parcel={mockParcel(2)} />
    </Router>,
  );
  expect(getByText(/View/i)).toBeInTheDocument();
});

it('always displays update option for sres', () => {
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
      <ParcelPopupView parcel={mockParcel(2)} />
    </Router>,
  );
  expect(getByText(/Update/i)).toBeInTheDocument();
});
