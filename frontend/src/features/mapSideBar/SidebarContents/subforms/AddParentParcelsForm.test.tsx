import { useKeycloak } from '@react-keycloak/web';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ILookupCode } from 'actions/ILookupCode';
import { IParcel } from 'actions/parcelsActions';
import { mockParcel } from 'components/maps/leaflet/InfoSlideOut/InfoContent.test';
import * as API from 'constants/API';
import * as reducerTypes from 'constants/reducerTypes';
import { Formik } from 'formik';
import { createMemoryHistory } from 'history';
import { noop } from 'lodash';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { fillInput } from 'utils/testUtils';

import AddParentParcelsForm from './AddParentParcelsForm';

jest.mock('@react-keycloak/web');
(useKeycloak as jest.Mock).mockReturnValue({
  keycloak: {
    userInfo: {
      agencies: [1],
      roles: [],
    },
    subject: 'test',
  },
});

const mockStore = configureMockStore([thunk]);
const lCodes = {
  lookupCodes: [
    { name: 'agencyVal', id: '1', isDisabled: false, type: API.AGENCY_CODE_SET_NAME },
    { name: 'roleVal', id: '1', isDisabled: false, type: API.ROLE_CODE_SET_NAME },
  ] as ILookupCode[],
};

const store = mockStore({
  [reducerTypes.LOOKUP_CODE]: lCodes,
  [reducerTypes.PARCEL]: { parcels: [] },
});

const findMatchingPid = jest.fn();
const history = createMemoryHistory();

const testRender = (parcels?: IParcel[]) => (
  <Provider store={store}>
    <MemoryRouter initialEntries={[history.location]}>
      <ToastContainer
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
      />
      <Formik
        initialValues={{ searchParentPid: '', parcels: [...(parcels ?? [])] }}
        onSubmit={noop}
      >
        {() => <AddParentParcelsForm findMatchingPid={findMatchingPid} />}
      </Formik>
    </MemoryRouter>
  </Provider>
);

describe('add parent parcels page', () => {
  beforeEach(() => {
    findMatchingPid.mockReset();
  });
  it('renders normally', () => {
    const { container } = render(testRender());
    expect(container.firstChild).toMatchSnapshot();
  });
  it('renders when not disabled', () => {
    const { container } = render(testRender());
    expect(container.firstChild).toMatchSnapshot();
  });
  it('renders when there are associated parcels', () => {
    const { container } = render(testRender([{ ...mockParcel, parcels: [mockParcel] }]));
    expect(container.firstChild).toMatchSnapshot();
  });

  it('makes a web request during pid searches', async () => {
    const { container, findByText, getByTestId } = render(testRender());
    fillInput(container, 'searchParentPid', 1);
    findMatchingPid.mockReturnValue(mockParcel);
    const searchButton = getByTestId('search-button');
    act(() => {
      fireEvent.click(searchButton);
    });
    expect(findMatchingPid).toHaveBeenCalled();
    await findByText('PID 000-000-000');
  });

  it('displays an error if there is no search match', async () => {
    const { container, getByTestId } = render(testRender());
    fillInput(container, 'searchParentPid', 1);
    findMatchingPid.mockReturnValue(undefined);
    const searchButton = getByTestId('search-button');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(findMatchingPid).toHaveBeenCalled();
    });
    await waitFor(async () =>
      expect(
        await screen.findByText(
          `enter a PID for a property that is already in the PIMS Inventory. If it is not you'll need to add it to PIMS first before trying to create a subdivision from it.`,
        ),
      ).toBeInTheDocument(),
    );
  });
});
