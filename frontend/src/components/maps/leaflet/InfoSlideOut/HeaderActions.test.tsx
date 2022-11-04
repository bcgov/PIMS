import 'leaflet';
import 'leaflet/dist/leaflet.css';

import { useKeycloak } from '@react-keycloak/web';
import { render } from '@testing-library/react';
import { IBuilding, IParcel } from 'actions/parcelsActions';
import { PropertyTypes } from 'constants/propertyTypes';
import { createMemoryHistory } from 'history';
import { noop } from 'lodash';
import * as React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import HeaderActions from './HeaderActions';
import { mockParcel } from './InfoContent.test';

jest.mock('@react-keycloak/web');
(useKeycloak as jest.Mock).mockReturnValue({
  keycloak: {
    userInfo: {
      agencies: [1],
      roles: [],
    },
    subject: 'test',
  },
});

const history = createMemoryHistory();
const mockStore = configureMockStore([thunk]);
const store = mockStore({});

const HeaderComponent = (
  propertyInfo: IParcel | IBuilding | null,
  propertyTypeId: PropertyTypes | null,
  canViewDetails: boolean,
  canEditDetails: boolean,
) => {
  return (
    <Provider store={store}>
      <Router history={history}>
        <HeaderActions
          propertyInfo={propertyInfo}
          propertyTypeId={propertyTypeId}
          canViewDetails={canViewDetails}
          canEditDetails={canEditDetails}
          jumpToView={noop}
          zoomToView={noop}
        />
      </Router>
    </Provider>
  );
};

describe('HeaderActions View', () => {
  it('HeaderActions renders correctly', () => {
    const { container } = render(HeaderComponent(mockParcel, PropertyTypes.PARCEL, true, true));
    expect(container.firstChild).toMatchSnapshot();
  });

  it('Shows all three actions when user has all permissions', () => {
    const { getByText } = render(HeaderComponent(mockParcel, PropertyTypes.PARCEL, true, true));
    expect(getByText('View details')).toBeVisible();
    expect(getByText('Update')).toBeVisible();
    expect(getByText('Zoom map')).toBeVisible();
  });

  it('Shows Zoom and View when user has view permissions', () => {
    const { getByText, queryByText } = render(
      HeaderComponent(mockParcel, PropertyTypes.PARCEL, true, false),
    );
    expect(getByText('View details')).toBeVisible();
    expect(queryByText('Update')).toBeNull();
    expect(getByText('Zoom map')).toBeVisible();
  });

  it('Shows Zoom only when user no permissions', () => {
    const { getByText, queryByText } = render(
      HeaderComponent(mockParcel, PropertyTypes.PARCEL, false, false),
    );
    expect(queryByText('View details')).toBeNull();
    expect(queryByText('Update')).toBeNull();
    expect(getByText('Zoom map')).toBeVisible();
  });
});
