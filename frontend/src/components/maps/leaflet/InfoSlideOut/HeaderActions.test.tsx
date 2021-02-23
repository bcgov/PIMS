import * as React from 'react';
import 'leaflet';
import 'leaflet/dist/leaflet.css';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { IParcel, IBuilding } from 'actions/parcelsActions';
import { PropertyTypes } from 'constants/propertyTypes';
import { render } from '@testing-library/react';
import { noop } from 'lodash';
import HeaderActions from './HeaderActions';
import { mockParcel } from './InfoContent.test';

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
