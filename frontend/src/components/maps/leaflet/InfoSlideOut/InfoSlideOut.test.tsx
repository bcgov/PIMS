import 'leaflet';
import 'leaflet/dist/leaflet.css';

import Adapter from '@cfaester/enzyme-adapter-react-18';
import { waitFor } from '@testing-library/dom';
import Claims from 'constants/claims';
import Enzyme, { mount } from 'enzyme';
import { createMemoryHistory } from 'history';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { Map as LeafletMap } from 'leaflet';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { MapContainer as ReactLeafletMap } from 'react-leaflet';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import useKeycloakMock from 'useKeycloakWrapperMock';

import InfoSlideOut from './InfoSlideOut';

const userRoles: string[] | Claims[] = [];
const userAgencies: number[] = [1];
const userAgency: number = 1;

jest.mock('hooks/useKeycloakWrapper');
(useKeycloakWrapper as jest.Mock).mockReturnValue(
  new (useKeycloakMock as any)(userRoles, userAgencies, userAgency),
);

Enzyme.configure({ adapter: new Adapter() });
const history = createMemoryHistory();
const mockStore = configureMockStore([thunk]);
const store = mockStore({});

let mapRef: React.RefObject<LeafletMap> | undefined;

const MapComponent = () => {
  const [open, setOpen] = React.useState(false);
  mapRef = React.useRef<any>();
  return (
    <Provider store={store}>
      <MemoryRouter initialEntries={[history.location]}>
        <div id="mapid" style={{ width: 500, height: 500 }}>
          <ReactLeafletMap ref={mapRef} center={[48.423078, -123.360956]} zoom={18}>
            <InfoSlideOut open={open} setOpen={() => setOpen(!open)} />
          </ReactLeafletMap>
        </div>
      </MemoryRouter>
    </Provider>
  );
};

describe('InfoSlideOut View', () => {
  beforeEach(() => {
    mapRef = undefined;
  });

  it('Should render the slide out button', () => {
    const component = mount(<MapComponent />);
    waitFor(() => expect(mapRef?.current).toBeTruthy(), { timeout: 500 });
    const infoButton = component.find(Button).first();
    expect(infoButton).toBeDefined();
    expect(infoButton.props().id).toBe('slideOutInfoButton');
  });

  it('Component should be closed by default', () => {
    const component = mount(<MapComponent />);
    waitFor(() => expect(mapRef?.current).toBeTruthy(), { timeout: 500 });
    const infoContainer = component.find('#infoContainer').first();
    expect(infoContainer).toBeDefined();
    expect(infoContainer.props().className?.includes('closed')).toBeTruthy();
  });

  it('Clicking the button should open the info component', () => {
    const component = mount(<MapComponent />);
    waitFor(() => expect(mapRef?.current).toBeTruthy(), { timeout: 500 });
    const infoContainer = component.find('#infoContainer').first();
    const infoButton = component.find('#slideOutInfoButton').first();
    expect(infoContainer).toBeDefined();
    expect(infoButton).toBeDefined();
    expect(infoContainer.props().className?.includes('closed')).toBeTruthy();
    infoButton.invoke('onClick');
    waitFor(() => expect(infoContainer.props().className?.includes('closed')).toBeFalsy(), {
      timeout: 500,
    });
  });

  it('Clicking the button should close the info component', () => {
    const component = mount(<MapComponent />);
    waitFor(() => expect(mapRef?.current).toBeTruthy(), { timeout: 500 });
    const infoContainer = component.find('#infoContainer').first();
    const infoButton = component.find('#slideOutInfoButton').first();
    expect(infoContainer).toBeDefined();
    expect(infoButton).toBeDefined();
    expect(infoContainer.props().className?.includes('closed')).toBeTruthy();
    infoButton.invoke('onClick');
    waitFor(() => expect(infoContainer.props().className?.includes('closed')).toBeFalsy(), {
      timeout: 500,
    });
    infoButton.invoke('onClick');
    waitFor(() => expect(infoContainer.props().className?.includes('closed')).toBeTruthy(), {
      timeout: 500,
    });
  });
});
