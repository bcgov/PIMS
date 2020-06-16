import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import * as reducerTypes from 'constants/reducerTypes';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { useKeycloak } from '@react-keycloak/web';
import SubmitProperty from './SubmitProperty';
import { render, fireEvent, act, cleanup } from '@testing-library/react';
import { mockDetails } from 'mocks/filterDataMock';
import { Claims } from 'constants/claims';

jest.mock('./MapView', () => () => <div id="mockMapView"></div>);
jest.mock('@react-keycloak/web');
jest.mock('leaflet');

jest.spyOn(Date, 'now').mockReturnValueOnce(new Date('December 25, 1991 13:12:00').getTime());

Enzyme.configure({ adapter: new Adapter() });
(useKeycloak as jest.Mock).mockReturnValue({
  keycloak: {
    userInfo: {
      agencies: [mockDetails[0]?.agencyId],
      roles: [Claims.ADMIN_PROPERTIES],
    },
    subject: 'test',
  },
});

const mockStore = configureMockStore([thunk]);
const history = createMemoryHistory();
const store = mockStore({
  [reducerTypes.LOOKUP_CODE]: { lookupCodes: [] },
  [reducerTypes.PARCEL]: { parcelDetail: { parcelTypeId: 0, parcelDetail: mockDetails[0] } },
  [reducerTypes.LEAFLET_CLICK_EVENT]: {},
  [reducerTypes.NETWORK]: {
    parcel: {
      status: 201,
    },
  },
});

const getSubmitProperty = (props: any, reduxStore: any = store) => (
  <Provider store={reduxStore}>
    <Router history={history}>
      <SubmitProperty {...props} />
    </Router>
  </Provider>
);

describe('SubmitProperty', () => {
  afterEach(() => {
    cleanup();
  });
  it('SubmitProperty loads building data in update mode', () => {
    const store = mockStore({
      [reducerTypes.LOOKUP_CODE]: { lookupCodes: [] },
      [reducerTypes.PARCEL]: { parcelDetail: { parcelTypeId: 1, parcelDetail: mockDetails[0] } },
      [reducerTypes.LEAFLET_CLICK_EVENT]: {},
      [reducerTypes.NETWORK]: {
        parcel: {
          status: 201,
        },
      },
    });
    const { getByText } = render(
      getSubmitProperty({ match: { params: { id: mockDetails[0]?.id } } }, store),
    );
    expect(getByText('Property Detail')).toBeInTheDocument();
  });

  xit('SubmitProperty renders edit button if parcel detail loaded.', () => {
    const { getByText } = render(
      getSubmitProperty({ match: { params: { id: mockDetails[0]?.id } } }),
    );
    getByText('Property Detail');
  });

  it('SubmitProperty delete functionality', () => {
    const { getByText } = render(
      getSubmitProperty({ match: { params: { id: mockDetails[0]?.id } } }),
    );
    const deleteButton = getByText('Delete');
    act(() => {
      fireEvent.click(deleteButton);
    });
    expect(getByText('Are you sure you want to permanently delete the property?')).toBeVisible();
  });

  it('SubmitProperty renders update header when given a parcelId', () => {
    const { getByText } = render(
      getSubmitProperty({ match: { params: { id: mockDetails[0]?.id } } }),
    );
    getByText('Property Detail');
  });

  it('SubmitProperty renders a view header by default', () => {
    const { getByText } = render(getSubmitProperty({ location: { search: 'disabled=true' } }));
    expect(getByText('Property Detail')).toBeInTheDocument();
  });

  xit('SubmitProperty edit button is disabled if agencies not match', () => {
    let store: any = mockStore({
      [reducerTypes.LOOKUP_CODE]: { lookupCodes: [] },
      [reducerTypes.PARCEL]: { parcelDetail: { parcelTypeId: 1, parcelDetail: mockDetails[1] } },
      [reducerTypes.LEAFLET_CLICK_EVENT]: {},
      [reducerTypes.NETWORK]: {
        parcel: {
          status: 201,
        },
      },
    });

    const { getByText } = render(getSubmitProperty({ match: { params: { id: 2 } } }, store));
    expect(getByText('Property Detail')).toBeVisible();
  });

  it('SubmitProperty disables edit button when clicked', () => {
    const { getByText } = render(
      getSubmitProperty({ match: { params: { id: mockDetails[0]?.id } } }),
    );
    const edit = getByText('Edit');
    act(() => {
      fireEvent.click(edit);
    });
    expect(edit).toHaveAttribute('disabled');
  });

  it('Displays a modal when close is clicked if there is saved form data', () => {
    window.localStorage.setItem('parcelDetailForm', 'some test data');
    const { getByText, getByTitle } = render(getSubmitProperty({}));
    const close = getByTitle('close');
    act(() => {
      fireEvent.click(close);
    });
    expect(getByText('Unsaved Draft')).toBeVisible();
  });

  it('Edit button available for sres even when they dont belong to agency', () => {
    let store: any = mockStore({
      [reducerTypes.LOOKUP_CODE]: { lookupCodes: [] },
      [reducerTypes.PARCEL]: { parcelDetail: { parcelTypeId: 1, parcelDetail: mockDetails[1] } },
      [reducerTypes.LEAFLET_CLICK_EVENT]: {},
      [reducerTypes.NETWORK]: {
        parcel: {
          status: 201,
        },
      },
    });
    const { getByText } = render(getSubmitProperty({ match: { params: { id: 2 } } }, store));
    expect(getByText('Edit')).toBeInTheDocument();
  });
});
