import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { IParcelDetail } from 'actions/parcelsActions';
import { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import * as reducerTypes from 'constants/reducerTypes';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { useKeycloak } from '@react-keycloak/web';
import { mountToJson } from 'enzyme-to-json';
import SubmitProperty from './SubmitProperty';

jest.mock('./MapView', () => () => <div id="mockMapView"></div>);
jest.mock('@react-keycloak/web');
jest.mock('leaflet');

jest.spyOn(Date, 'now').mockReturnValueOnce(new Date('December 25, 1991 13:12:00').getTime());

Enzyme.configure({ adapter: new Adapter() });
(useKeycloak as jest.Mock).mockReturnValue({
  keycloak: {
    userInfo: {
      agencies: ['1'],
    },
    subject: 'test',
  },
});
const mockStore = configureMockStore([thunk]);

// This will spoof the active parcel (the one that will populate the popup details)
const mockDetails: IParcelDetail = {
  propertyTypeId: 0,
  parcelDetail: {
    id: 1,
    pid: '000-000-000',
    pin: '',
    projectNumber: '',
    statusId: 0,
    classificationId: 0,
    zoning: '',
    zoningPotential: '',
    agencyId: 0,
    latitude: 48,
    longitude: 123,
    propertyStatus: 'active',
    classification: 'Core Operational',
    description: 'test',
    isSensitive: false,
    municipality: '',
    evaluations: [
      {
        date: 'December 25, 1991 13:12:00',
        key: '',
        value: 100000,
      },
    ],
    fiscals: [],
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
const history = createMemoryHistory();
const store = mockStore({
  [reducerTypes.LOOKUP_CODE]: { lookupCodes: [] },
  [reducerTypes.PARCEL]: { parcelDetail: mockDetails },
  [reducerTypes.LEAFLET_CLICK_EVENT]: {},
  [reducerTypes.NETWORK]: {
    parcel: {
      status: 201,
    },
  },
});

xit('SubmitProperty renders a disabled form if agency does not match current user.', () => {
  const tree = mount(
    <Provider store={store}>
      <Router history={history}>
        <SubmitProperty />
      </Router>
    </Provider>,
  );
  expect(mountToJson(tree.find(SubmitProperty))).toMatchSnapshot();
});
