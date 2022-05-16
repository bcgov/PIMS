import EditAdminArea from './EditAdminArea';
import { render } from '@testing-library/react';
import React from 'react';
import configureMockStore from 'redux-mock-store';
import { createMemoryHistory } from 'history';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import * as reducerTypes from 'constants/reducerTypes';
import { Router } from 'react-router';
import * as API from 'constants/API';
import { ILookupCode } from 'actions/ILookupCode';

const mockStore = configureMockStore([thunk]);

const history = createMemoryHistory();
const lCodes = {
  lookupCodes: [
    {
      name: 'Test 1',
      isDisabled: false,
      id: '1',
      code: '1',
      type: API.AMINISTRATIVE_AREA_CODE_SET_NAME,
    },
    {
      name: 'Test 2',
      isDisabled: false,
      id: '2',
      code: '2',
      type: API.AMINISTRATIVE_AREA_CODE_SET_NAME,
    },
  ] as ILookupCode[],
};
const store = mockStore({
  [reducerTypes.LOOKUP_CODE]: lCodes,
});

it('renders correctly', () => {
  const { asFragment } = render(
    <Provider store={store}>
      <Router history={history}>
        <EditAdminArea name="test" />
      </Router>
    </Provider>,
  );
  expect(asFragment()).toMatchSnapshot();
});
