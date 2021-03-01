import React from 'react';
import ProjectDraftStep from './ProjectDraftStep';
import * as reducerTypes from 'constants/reducerTypes';
import { createMemoryHistory } from 'history';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { ProjectActions } from 'constants/actionTypes';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { fillInput } from 'utils/testUtils';
import useStepper from '../hooks/useStepper';
import { noop } from 'lodash';
import { render, screen, cleanup, wait } from '@testing-library/react';

const mockAxios = new MockAdapter(axios);
jest.mock('../hooks/useStepper');
(useStepper as jest.Mock).mockReturnValue({
  currentStatus: {},
  project: { agencyId: 1, projectNumber: 'TEST-NUMBER', properties: [] },
  projectStatusCompleted: noop,
  canGoToStatus: noop,
  getLastCompletedStatus: jest.fn(),
  getNextStep: jest.fn(),
});
mockAxios.onAny().reply(200, {});

const mockStore = configureMockStore([thunk]);
const history = createMemoryHistory();

const store = mockStore({
  [reducerTypes.ProjectReducers.PROJECT]: { agencyId: 1 },
  [reducerTypes.LOOKUP_CODE]: { lookupCodes: [] },
  [reducerTypes.NETWORK]: {
    [ProjectActions.GET_PROJECT]: {},
  },
});

const uiElement = (
  <Provider store={store}>
    <Router history={history}>
      <ProjectDraftStep />
    </Router>
  </Provider>
);

describe('Project Draft Step', () => {
  afterEach(() => {
    cleanup();
  });
  it('renders correctly', () => {
    const { container } = render(uiElement);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('requires name', async () => {
    const { container, findByText } = render(uiElement);
    container.querySelector('form');
    await fillInput(container, 'name', '');
    await fillInput(container, 'description', 'description', 'textarea');
    await wait(async () => {
      expect(await findByText('Required')).toBeInTheDocument();
    });
  });

  it('can be submitted after required filled', async () => {
    const { container, findByText } = render(uiElement);
    container.querySelector('form');
    await fillInput(container, 'name', '');
    await fillInput(container, 'description', 'description', 'textarea');
    await wait(async () => {
      expect(await findByText('Required')).toBeInTheDocument();
    });
  });

  it('loads the projectNumber', () => {
    render(uiElement);
    expect(screen.getByDisplayValue('TEST-NUMBER')).toBeInTheDocument();
  });
});
