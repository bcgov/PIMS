import React from 'react';
import renderer from 'react-test-renderer';
import ProjectDraftStep from './ProjectDraftStep';
import * as reducerTypes from 'constants/reducerTypes';
import { createMemoryHistory } from 'history';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';

const mockStore = configureMockStore([thunk]);
const history = createMemoryHistory();

const store = mockStore({
  [reducerTypes.ProjectReducers.PROJECT]: {},
});

const uiElement = (
  <Provider store={store}>
    <Router history={history}>
      <ProjectDraftStep />
    </Router>
  </Provider>
);

it('renders correctly', () => {
  const tree = renderer.create(uiElement).toJSON();
  expect(tree).toMatchSnapshot();
});
