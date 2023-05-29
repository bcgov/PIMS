import { render } from '@testing-library/react';
import { ILookupCode } from 'actions/ILookupCode';
import * as API from 'constants/API';
import * as reducerTypes from 'constants/reducerTypes';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import EditAdminArea from './EditAdminArea';

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
      <MemoryRouter initialEntries={[history.location]}>
        <EditAdminArea />
      </MemoryRouter>
    </Provider>,
  );
  expect(asFragment()).toMatchSnapshot();
});
