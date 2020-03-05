import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { ParcelPopupView } from 'components/maps/ParcelPopupView';
import { IParcelDetail, IParcel } from 'actions/parcelsActions';
import Map from './Map';
import { Marker } from 'react-leaflet';
import { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import { render } from '@testing-library/react';

Enzyme.configure({ adapter: new Adapter() });

// This will spoof the active parcel (the one that will populate the popup details)
const mockDetails: IParcelDetail = {
  id: 1,
  pid: '000-000-000',
  latitude: 48,
  longitude: 123,
  propertyStatus: 'active',
  classification: 'Core Operational',
  description: 'test',
  assessedValue: 1000000,
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
};

// To check for alert message
const emptyDetails = null;

// This mocks the parcels of land a user can see - should be able to see 2 markers
const mockParcels = [
  { id: 1, latitude: 48, longitude: 123 },
  { id: 2, latitude: 50, longitude: 133 },
] as IParcel[];
const noParcels = [] as IParcel[];

const history = createMemoryHistory();

// Check that the markers have correct position given the mock parcel 1 above
it('Renders the marker in correct position', () => {
  const component = mount(
    <Router history={history}>
      <Map
        lat={48.43}
        lng={-123.37}
        zoom={14}
        parcels={mockParcels}
        activeParcel={mockDetails}
        agencies={[]}
        propertyClassifications={[]}
        onParcelClick={jest.fn()}
      />
    </Router>,
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
        parcels={noParcels}
        activeParcel={emptyDetails}
        agencies={[]}
        propertyClassifications={[]}
        onParcelClick={jest.fn()}
      />
    </Router>,
  );
  const marker = component.find(Marker);
  expect(marker.length).toBe(0);
});

// 2 parcels in mock data, check to see 2 markers are created
it('Marker for each parcel is created', () => {
  const component = mount(
    <Router history={history}>
      <Map
        lat={48.43}
        lng={-123.37}
        zoom={14}
        parcels={mockParcels}
        activeParcel={mockDetails}
        agencies={[]}
        propertyClassifications={[]}
        onParcelClick={jest.fn()}
      />
    </Router>,
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
      parcels={mockParcels}
      activeParcel={mockDetails}
      agencies={[]}
      propertyClassifications={[]}
      onParcelClick={onParcelClick}
    />,
  );
  const marker = component.find(Marker).first();
  marker.simulate('click');
  expect(onParcelClick).toBeCalledTimes(1);
});

// Check that error message is displayed on null details
it('Displays proper message when no details loaded', () => {
  const { getByText } = render(<ParcelPopupView parcelDetail={emptyDetails} />);
  const alert = getByText('Failed to load parcel details.');
  expect(alert).toBeTruthy();
});

it('ParcelPopupView renders correctly', () => {
  const tree = renderer.create(<ParcelPopupView parcelDetail={mockDetails} />).toJSON();
  expect(tree).toMatchSnapshot();
});
