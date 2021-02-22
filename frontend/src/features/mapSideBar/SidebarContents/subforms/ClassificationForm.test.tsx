import React from 'react';
import renderer from 'react-test-renderer';
import { cleanup, fireEvent, render, wait } from '@testing-library/react';
import { Formik } from 'formik';
import { noop } from 'lodash';
import axios from 'axios';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { useKeycloak } from '@react-keycloak/web';
import { ClassificationForm } from './ClassificationForm';
import { Classifications } from 'constants/classifications';
import { SelectOption, SelectOptions } from 'components/common/form';
import * as API from 'constants/API';
import * as reducerTypes from 'constants/reducerTypes';
import { ILookupCode } from 'actions/lookupActions';

jest.mock('axios');
jest.mock('@react-keycloak/web');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockClassifications = [
  { value: Classifications.CoreOperational, label: 'Core Operational' } as SelectOption,
  { value: Classifications.CoreStrategic, label: 'Core Strategic' } as SelectOption,
  { value: Classifications.SurplusEncumbered, label: 'Surplus Encumbered' } as SelectOption,
] as SelectOptions;

const mockKeycloak = (claims: string[]) => {
  (useKeycloak as jest.Mock).mockReturnValue({
    keycloak: {
      subject: 'test',
      userInfo: {
        roles: claims,
        agencies: ['1'],
      },
    },
  });
};
const mockStore = configureMockStore([thunk]);
let history = createMemoryHistory();

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
  const tree = renderer.create(form).toJSON();
  expect(tree).toMatchSnapshot();
});

const form = (
  <Provider store={getStore()}>
    <Router history={history}>
      <Formik onSubmit={noop} initialValues={{ classificationId: '' }}>
        <ClassificationForm
          classifications={mockClassifications}
          field="classificationId"
          encumbranceField="test"
        />
      </Formik>
    </Router>
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
    await wait(() => {
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
    await wait(() => {
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
    await wait(() => {
      fireEvent.change(classificationId!, {
        target: {
          value: Classifications.SurplusEncumbered,
        },
      });
    });
    expect(getByText(/surplus Encumbered – assets that are surplus/i)).toBeInTheDocument();
  });
});
