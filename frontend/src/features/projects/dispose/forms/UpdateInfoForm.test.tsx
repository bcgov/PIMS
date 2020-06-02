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
import { render } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

const mockStore = configureMockStore([thunk]);
const mockProject = { project: { tierLevelId: 1, properties: [] } };
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
});
const initialValues = mockProject.project;
const history = createMemoryHistory();

const renderComponent = () => {
  return renderer.create(getUpdateInfoForm());
};

const getUpdateInfoForm = () => {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Formik onSubmit={() => {}} initialValues={initialValues}>
          <Form>
            <UpdateInfoForm />
          </Form>
        </Formik>
      </Router>
    </Provider>
  );
};

describe('Update Info Form', () => {
  it('Matches Snapshot', () => {
    const component = renderComponent();
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('Loads tiers from initialValues', () => {
    const { getByText } = render(getUpdateInfoForm());
    expect(getByText('Tier 2')).toBeVisible();
  });
});
