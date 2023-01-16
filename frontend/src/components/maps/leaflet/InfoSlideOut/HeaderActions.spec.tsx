import 'leaflet';
import 'leaflet/dist/leaflet.css';

import { render } from '@testing-library/react';
import { IBuilding, IParcel } from 'actions/parcelsActions';
import Claims from 'constants/claims';
import { PropertyTypes } from 'constants/propertyTypes';
import { createMemoryHistory } from 'history';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { noop } from 'lodash';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import useKeycloakMock from 'useKeycloakWrapperMock';
import * as Vitest from 'vitest';
import { vi } from 'vitest';

import HeaderActions from './HeaderActions';
import { mockParcel } from './InfoContent.spec';

const userRoles: string[] | Claims[] = [];
const userAgencies: number[] = [1];
const userAgency: number = 1;

vi.mock('hooks/useKeycloakWrapper');
(useKeycloakWrapper as Vitest.Mock).mockReturnValue(
  new (useKeycloakMock as any)(userRoles, userAgencies, userAgency),
);

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
      <MemoryRouter initialEntries={[history.location]}>
        <HeaderActions
          propertyInfo={propertyInfo}
          propertyTypeId={propertyTypeId}
          canViewDetails={canViewDetails}
          canEditDetails={canEditDetails}
          jumpToView={noop}
          zoomToView={noop}
        />
      </MemoryRouter>
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
