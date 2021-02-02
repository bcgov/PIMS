import * as React from 'react';
import 'leaflet';
import { Map as LeafletMap } from 'leaflet';
import { Map as ReactLeafletMap, MapProps } from 'react-leaflet';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { mount } from 'enzyme';
import InfoSlideOut from './InfoSlideOut';
import 'leaflet/dist/leaflet.css';
import { waitFor } from '@testing-library/dom';
import { Button } from 'react-bootstrap';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';

Enzyme.configure({ adapter: new Adapter() });
const history = createMemoryHistory();
const mockStore = configureMockStore([thunk]);
const store = mockStore({});

let mapRef: React.RefObject<ReactLeafletMap<MapProps, LeafletMap>> | undefined;

const MapComponent = () => {
  const [open, setOpen] = React.useState(false);
  mapRef = React.useRef<any>();
  return (
    <Provider store={store}>
      <Router history={history}>
        <div id="mapid" style={{ width: 500, height: 500 }}>
          <ReactLeafletMap ref={mapRef} center={[48.423078, -123.360956]} zoom={18}>
            <InfoSlideOut open={open} setOpen={() => setOpen(!open)} />
          </ReactLeafletMap>
        </div>
      </Router>
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
