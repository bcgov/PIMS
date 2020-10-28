import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import UpdateInfoForm from './UpdateInfoForm';
import * as reducerTypes from 'constants/reducerTypes';
import { Formik } from 'formik';
import { Form } from 'react-bootstrap';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render, wait, fireEvent, cleanup } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { ProjectActions } from 'constants/actionTypes';
import { CLASSIFICATIONS } from 'constants/classifications';
import { UpdateInfoStepYupSchema } from '../../dispose';

const mockStore = configureMockStore([thunk]);
const mockProject = {
  project: {
    tierLevelId: 1,
    properties: [
      {
        address: 'Test, Alert Bay',
        addressId: 1,
        agency: 'Ministry of Advanced Education, Skills & Training',
        agencyCode: 'AEST',
        agencyId: 1,
        appraised: 0,
        assessed: 1,
        assessedDate: '2020-01-01T00:00:00',
        city: 'Alert Bay',
        classification: 'Core Operational',
        classificationId: 0,
        constructionTypeId: 0,
        description: '',
        estimated: 0,
        floorCount: 0,
        id: 1,
        isSensitive: false,
        landArea: 123,
        landLegalDescription: '',
        latitude: 48.42538763146778,
        longitude: -123.39006198220181,
        administrativeArea: '',
        netBook: 1,
        netBookFiscalYear: 2020,
        occupantTypeId: 0,
        pid: '213-221-321',
        postal: '',
        predominateUseId: 0,
        propertyTypeId: 0,
        province: 'British Columbia',
        rentableArea: 0,
        transferLeaseOnSale: false,
        zoning: '',
        zoningPotential: '',
      },
    ],
  },
};
const mockAxios = new MockAdapter(axios);
mockAxios.onAny().reply(200, {});
const store = mockStore({
  ...mockProject,
  [reducerTypes.LOOKUP_CODE]: {
    lookupCodes: [
      { type: 'TierLevel', name: 'Tier 1', id: 1 },
      { type: 'TierLevel', name: 'Tier 2', id: 2 },
    ],
  },
  [reducerTypes.NETWORK]: {
    [ProjectActions.GET_PROJECT]: {},
  },
});

const initialValues = mockProject.project;
const history = createMemoryHistory();

const renderComponent = () => {
  return renderer.create(getUpdateInfoForm());
};

const initialTouched: any = {
  properties: [{ classificationId: 'Must select Surplus Active or Surplus Encumbered' }],
};

const getUpdateInfoForm = () => {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Formik
          onSubmit={() => {}}
          initialValues={initialValues}
          validationSchema={UpdateInfoStepYupSchema}
          initialTouched={initialTouched}
        >
          <Form>
            <UpdateInfoForm />
          </Form>
        </Formik>
      </Router>
    </Provider>
  );
};

describe('Update Info Form', () => {
  afterEach(() => {
    cleanup();
  });
  it('Matches Snapshot', () => {
    const component = renderComponent();
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('Loads tiers from initialValues', () => {
    const { getByText } = render(getUpdateInfoForm());
    expect(getByText('Tier 2')).toBeVisible();
  });

  it('displays validation error when not surplus active/encumbered', async () => {
    const { getByText, container } = render(getUpdateInfoForm());
    const classificationId = container.querySelector(
      'select[name="properties.0.classificationId"]',
    );
    await wait(() => {
      fireEvent.change(classificationId!, {
        target: {
          value: CLASSIFICATIONS.CoreOperational,
        },
      });
    });
    expect(getByText('Must select Surplus Active or Surplus Encumbered')).toBeVisible();
  });
});
