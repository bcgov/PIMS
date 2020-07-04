import React from 'react';
import renderer from 'react-test-renderer';
import SelectProjectProperties from './SelectProjectPropertiesStep';
import * as reducerTypes from 'constants/reducerTypes';
import { createMemoryHistory } from 'history';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { ProjectActions } from 'constants/actionTypes';

const mockStore = configureMockStore([thunk]);
const history = createMemoryHistory();

const store = mockStore({
  [reducerTypes.ProjectReducers.PROJECT]: { project: {} },
  [reducerTypes.LOOKUP_CODE]: { lookupCodes: [] },
  [reducerTypes.NETWORK]: {
    [ProjectActions.GET_PROJECT]: {},
  },
});

const uiElement = (
  <Provider store={store}>
    <Router history={history}>
      <SelectProjectProperties />
    </Router>
  </Provider>
);

it('renders correctly', () => {
  const tree = renderer.create(uiElement).toJSON();
  expect(tree).toMatchSnapshot();
});
