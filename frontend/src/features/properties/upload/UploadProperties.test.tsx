import { fireEvent, render, waitFor } from '@testing-library/react';
import { ILookupCode } from 'actions/ILookupCode';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as API from 'constants/API';
import * as reducerTypes from 'constants/reducerTypes';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { UploadProperties } from './UploadProperties';

const history = createMemoryHistory();
const mockStore = configureMockStore([thunk]);
const mockAxios = new MockAdapter(axios);
mockAxios.onAny().reply(200, [
  {
    pid: '1234',
  },
]);

const lCodes = {
  lookupCodes: [
    { name: 'agencyVal', id: '1', isDisabled: false, type: API.AGENCY_CODE_SET_NAME },
    {
      name: 'classificationVal',
      id: '1',
      isDisabled: false,
      type: API.PROPERTY_CLASSIFICATION_CODE_SET_NAME,
    },
  ] as ILookupCode[],
};

const store = mockStore({
  [reducerTypes.LOOKUP_CODE]: lCodes,
  usersAgencies: [{ id: '1', name: 'agencyVal' }],
});

const csvString =
  'Type,Classification,Name,Ministry,Location,Latitude,Longitude,PID\n\
Land,Core Operational,Property Name 1,AEST,North Saanich,52.15886178,-128.1077099,000-001-000\n\
Land,Core Operational,Property Name 2,AEST,Kitimat,52.15886178,-128.1077099,000-001-001\n\
Land,Core Strategic,Property Name 3,AEST,Metchosin,52.15886178,-128.1077099,000-001-002\n\
Building,Core Operational,Property Name 4,AEST,Metchosin,52.15886178,-128.1077099,000-001-003\n\
Building,Core Operational,Property Name 5,AEST,Metchosin,52.15886178,-128.1077099,000-001-004\n\
Land,Core Operational,Property Name 6,CITZ,Victoria,52.15886178,-128.1077099,000-001-005\n\
Land,Core Operational,Property Name 7,CITZ,Victoria,52.15886178,-128.1077099,000-001-006\n\
Land,Core Operational,Property Name 8,AEST,Campbell River,52.15886178,-128.1077099,000-001-007\n\
Land,Core Strategic,Property Name 9,MOTI,Victoria,52.15886178,-128.1077099,000-001-008\n\
Building,Core Operational,Property Name 10,AEST,Victoria,52.15886178,-128.1077099,000-001-009\n';

const blob = new Blob([csvString], { type: 'text/csv' });
const file = new File([blob], 'test.csv', { type: 'text/csv' });

describe('Testing parent component for CSV Upload', () => {
  beforeEach(() => {});

  it('Sub-components render as expected', () => {
    const { queryByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[history.location]}>
          <UploadProperties />,
        </MemoryRouter>
      </Provider>,
    );
    expect(queryByText(/instructions/i)).toBeInTheDocument();
    expect(queryByText(/select file/i)).toBeInTheDocument();
  });

  it('File upload process start to end', async () => {
    const { container, queryByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[history.location]}>
          <UploadProperties />,
        </MemoryRouter>
      </Provider>,
    );

    // Disable scrollTo for this test
    Object.defineProperty(window.Element.prototype, 'scrollTo', {
      writable: true,
      value: jest.fn(),
    });

    // Upload file
    const fileInput = document.getElementById('file-input');
    await waitFor(() => {
      fireEvent.change(fileInput!, {
        target: { files: [file] },
      });
    });
    // Button should now be visible
    expect(container.querySelector('#upload-button')).toBeInTheDocument();
    // File name visible
    expect(queryByText('test.csv')).toBeInTheDocument();

    // Click "Start Upload"
    const startUpload = document.getElementById('upload-button');
    await waitFor(() => {
      fireEvent.click(startUpload!);
    });

    // Wait for state change
    await waitFor(() => {
      queryByText(/Do not leave/);
    });

    // Wait for last upload
    await waitFor(() => {
      queryByText(/PID 000-001-009/);
    });

    expect(queryByText('Upload Complete')).toBeInTheDocument();
  });
});
