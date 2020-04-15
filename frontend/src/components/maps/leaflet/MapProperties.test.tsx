import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { ParcelPopupView } from 'components/maps/ParcelPopupView';
import { IProperty, IParcelDetail } from 'actions/parcelsActions';
import Map from './Map';
import { Marker } from 'react-leaflet';
import { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import * as reducerTypes from 'constants/reducerTypes';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { render } from '@testing-library/react';
import { PopupView } from '../PopupView';
import { Provider } from 'react-redux';

Enzyme.configure({ adapter: new Adapter() });
const mockStore = configureMockStore([thunk]);

const store = mockStore({
  [reducerTypes.LOOKUP_CODE]: { lookupCodes: [] },
});

// This will spoof the active parcel (the one that will populate the popup details)
const mockDetails: IParcelDetail = {
  propertyTypeId: 0,
  parcelDetail: {
    id: 1,
    pid: '000-000-000',
    pin: '',
    statusId: 0,
    classificationId: 0,
    municipality: '',
    zoning: '',
    zoningPotential: '',
    agencyId: 0,
    latitude: 48,
    longitude: 123,
    propertyStatus: 'active',
    classification: 'Core Operational',
    description: 'test',
    isSensitive: false,
    evaluations: [
      {
        assessedValue: 1000000,
        estimatedValue: 0,
        fiscalYear: 2019,
        netBookValue: 0,
        appraisedValue: 0,
      },
    ],
    address: {
      line1: '1234 mock Street',
      line2: 'N/A',
      city: 'Victoria',
      province: 'BC',
      postal: 'V1V1V1',
    },
    landArea: 'unknown',
    landLegalDescription: 'test',
    buildings: [],
    agency: 'FIN',
  },
};

// To check for alert message
const emptyDetails = null;

// This mocks the parcels of land a user can see - should be able to see 2 markers
const mockParcels = [
  { id: 1, latitude: 48, longitude: 123 },
  { id: 2, latitude: 50, longitude: 133 },
] as IProperty[];
const noParcels = [] as IProperty[];

const history = createMemoryHistory();

// Check that the markers have correct position given the mock parcel 1 above
it('Renders the marker in correct position', () => {
  const component = mount(
    <Provider store={store}>
      <Router history={history}>
        <Map
          lat={48.43}
          lng={-123.37}
          zoom={14}
          properties={mockParcels}
          selectedProperty={mockDetails}
          agencies={[]}
          propertyClassifications={[]}
          lotSizes={[]}
          onMarkerClick={jest.fn()}
        />
      </Router>
    </Provider>,
  );
  const marker = component.find(Marker).first();
  expect(marker.prop('position')).toStrictEqual([48, 123]);
});

// Ensure no markers are rendered when there are no parcels
it('Should render 0 markers when there are no parcels', () => {
  const component = mount(
    <Router history={history}>
      <Map
        lat={48.43}
        lng={-123.37}
        zoom={14}
        properties={noParcels}
        selectedProperty={emptyDetails}
        agencies={[]}
        propertyClassifications={[]}
        lotSizes={[]}
        onMarkerClick={jest.fn()}
      />
    </Router>,
  );
  const marker = component.find(Marker);
  expect(marker.length).toBe(0);
});

// 2 parcels in mock data, check to see 2 markers are created
it('Marker for each parcel is created', () => {
  const component = mount(
    <Provider store={store}>
      <Router history={history}>
        <Map
          lat={48.43}
          lng={-123.37}
          zoom={14}
          properties={mockParcels}
          selectedProperty={mockDetails}
          agencies={[]}
          propertyClassifications={[]}
          lotSizes={[]}
          onMarkerClick={jest.fn()}
        />
      </Router>
    </Provider>,
  );
  const marker = component.find(Marker);
  expect(marker.length).toBe(2);
});

// When marker is clicked function to load the details should be called
it('Loads parcel details on click', () => {
  const onParcelClick = jest.fn();
  const component = shallow(
    <Map
      lat={48.43}
      lng={-123.37}
      zoom={14}
      properties={mockParcels}
      selectedProperty={mockDetails}
      agencies={[]}
      propertyClassifications={[]}
      lotSizes={[]}
      onMarkerClick={onParcelClick}
    />,
  );
  const marker = component.find(Marker).first();
  marker.simulate('click');
  expect(onParcelClick).toBeCalledTimes(1);
});

// Check that error message is displayed on null details
it('Displays proper message when no details loaded', () => {
  const { getByText } = render(
    <Provider store={store}>
      <Router history={history}>
        <ParcelPopupView parcel={emptyDetails} />
      </Router>
    </Provider>,
  );
  const alert = getByText('Failed to load parcel details.');
  expect(alert).toBeTruthy();
});

it('ParcelPopupView renders correctly', () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <Router history={history}>
          <PopupView
            propertyTypeId={mockDetails.propertyTypeId}
            propertyDetail={mockDetails.parcelDetail}
          />
        </Router>
      </Provider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
