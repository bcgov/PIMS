import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { ILookupCode } from 'actions/ILookupCode';
import axios from 'axios';
import { SelectOption, SelectOptions } from 'components/common/form';
import * as API from 'constants/API';
import { Classifications } from 'constants/classifications';
import * as reducerTypes from 'constants/reducerTypes';
import { Formik } from 'formik';
import { createMemoryHistory } from 'history';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { noop } from 'lodash';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import useKeycloakMock from 'useKeycloakWrapperMock';

import { ClassificationForm } from './ClassificationForm';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockClassifications = [
  { value: Classifications.CoreOperational, label: 'Core Operational' } as SelectOption,
  { value: Classifications.CoreStrategic, label: 'Core Strategic' } as SelectOption,
  { value: Classifications.SurplusEncumbered, label: 'Surplus Encumbered' } as SelectOption,
] as SelectOptions;

const userAgencies: number[] = [1];
const userAgency: number = 1;

jest.mock('hooks/useKeycloakWrapper');
const mockKeycloak = (claims: string[]) => {
  (useKeycloakWrapper as jest.Mock).mockReturnValue(
    new (useKeycloakMock as any)(claims, userAgencies, userAgency),
  );
};

const mockStore = configureMockStore([thunk]);
const history = createMemoryHistory();

const lCodes = {
  lookupCodes: [
    { name: 'agencyVal', id: '1', isDisabled: false, type: API.AGENCY_CODE_SET_NAME },
    { name: 'disabledAgency', id: '2', isDisabled: true, type: API.AGENCY_CODE_SET_NAME },
    { name: 'roleVal', id: '1', isDisabled: false, type: API.ROLE_CODE_SET_NAME },
    { name: 'disabledRole', id: '2', isDisabled: true, type: API.ROLE_CODE_SET_NAME },
    {
      name: 'Core Operational',
      id: '0',
      isDisabled: false,
      type: API.PROPERTY_CLASSIFICATION_CODE_SET_NAME,
    },
    {
      name: 'Core Strategic',
      id: '1',
      isDisabled: false,
      type: API.PROPERTY_CLASSIFICATION_CODE_SET_NAME,
    },
    {
      name: 'Surplus Active',
      id: '2',
      isDisabled: false,
      type: API.PROPERTY_CLASSIFICATION_CODE_SET_NAME,
    },
    {
      name: 'Surplus Encumbered',
      id: '3',
      isDisabled: false,
      type: API.PROPERTY_CLASSIFICATION_CODE_SET_NAME,
    },
    {
      name: 'Disposed',
      id: '4',
      isDisabled: false,
      type: API.PROPERTY_CLASSIFICATION_CODE_SET_NAME,
    },
    {
      name: 'Demolished',
      id: '5',
      isDisabled: false,
      type: API.PROPERTY_CLASSIFICATION_CODE_SET_NAME,
    },
    {
      name: 'Subdivided',
      id: '6',
      isDisabled: false,
      type: API.PROPERTY_CLASSIFICATION_CODE_SET_NAME,
    },
  ] as ILookupCode[],
};

const getStore = () =>
  mockStore({
    [reducerTypes.PROPERTY_NAMES]: ['test'],
    [reducerTypes.LOOKUP_CODE]: lCodes,
  });

it('renders correctly', () => {
  const { container } = render(form);
  expect(container.firstChild).toMatchSnapshot();
});

const form = (
  <Provider store={getStore()}>
    <MemoryRouter initialEntries={[history.location]}>
      <Formik onSubmit={noop} initialValues={{ classificationId: '' }}>
        <ClassificationForm
          classifications={mockClassifications}
          field="classificationId"
          encumbranceField="test"
        />
      </Formik>
    </MemoryRouter>
  </Provider>
);

describe('renders definitions correctly', () => {
  mockedAxios.get.mockImplementationOnce(() => Promise.resolve({}));

  beforeEach(() => {
    mockKeycloak([]);
  });
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });
  it('renders default defintion', () => {
    const { getByText } = render(form);
    expect(getByText(/select a classification/i)).toBeInTheDocument();
  });
  it('renders core operational definition', async () => {
    const { getByText, container } = render(form);
    const classificationId = container.querySelector('select[name="classificationId"]');
    await waitFor(() => {
      fireEvent.change(classificationId!, {
        target: {
          value: Classifications.CoreOperational,
        },
      });
    });
    expect(getByText(/core Operational – assets that are functionally/i)).toBeInTheDocument();
  });
  it('renders core strategic definition', async () => {
    const { getByText, container } = render(form);
    const classificationId = container.querySelector('select[name="classificationId"]');
    await waitFor(() => {
      fireEvent.change(classificationId!, {
        target: {
          value: Classifications.CoreStrategic,
        },
      });
    });
    expect(getByText(/core Strategic – assets that are uniquely/i)).toBeInTheDocument();
  });
  it('renders surplus encumbered definition', async () => {
    const { getByText, container } = render(form);
    const classificationId = container.querySelector('select[name="classificationId"]');
    await waitFor(() => {
      fireEvent.change(classificationId!, {
        target: {
          value: Classifications.SurplusEncumbered,
        },
      });
    });
    expect(getByText(/surplus Encumbered – assets that are surplus/i)).toBeInTheDocument();
  });
});
