import React from 'react';
import { act } from 'react-test-renderer';
import SelectProjectProperties from './SelectProjectPropertiesStep';
import * as reducerTypes from 'constants/reducerTypes';
import { createMemoryHistory } from 'history';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { ProjectActions } from 'constants/actionTypes';
import { render, wait, fireEvent, cleanup } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { mockKeycloak, mockProject } from '../testUtils';
import * as API from 'constants/API';
import { mockFlatProperty } from 'mocks/filterDataMock';
jest.mock('@react-keycloak/web');

const mockStore = configureMockStore([thunk]);
const history = createMemoryHistory();
const mockAxios = new MockAdapter(axios);

const store = mockStore({
  [reducerTypes.ProjectReducers.PROJECT]: { project: mockProject },
  [reducerTypes.LOOKUP_CODE]: {
    lookupCodes: [{ name: 'agencyVal', id: 1, isDisabled: false, type: API.AGENCY_CODE_SET_NAME }],
  },
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

describe('Select Project Properties Step', () => {
  beforeEach(() => {
    mockAxios.reset();
    mockKeycloak([], [1]);
  });
  afterEach(() => {
    cleanup();
  });
  it('renders correctly', async () => {
    mockAxios.onAny().reply(200, { items: [mockFlatProperty] });
    await act(async () => {
      const { container, findByText } = render(uiElement);
      expect(container.firstChild).toMatchSnapshot();
      await findByText('Test Property');
    });
  });

  it('requests properties based on the users agency', async () => {
    mockAxios.onAny().reply(200, { items: [mockFlatProperty] });
    render(uiElement);
    await wait(async () => {
      expect(mockAxios.history.get.length).toBe(1);
      expect(mockAxios.history.get[0].url).toMatch(/agencies=1/);
    });
  });
  it('initially requests properties using a default classification id', async () => {
    mockAxios.onAny().reply(200, { items: [mockFlatProperty] });
    render(uiElement);
    await wait(async () => {
      expect(mockAxios.history.get.length).toBe(1);
      expect(mockAxios.history.get[0].url).toMatch(/classificationId=2/);
    });
  });
  it('requests properties that may already be in another project', async () => {
    mockAxios.onAny().reply(200, { items: [mockFlatProperty] });
    render(uiElement);
    await wait(async () => {
      expect(mockAxios.history.get.length).toBe(1);
      expect(mockAxios.history.get[0].url).toMatch(/ignorePropertiesInProjects=false/);
    });
  });

  it('renders one row per property in the response', async () => {
    mockAxios.onAny().reply(200, { items: [mockFlatProperty] });
    const { findByText } = render(uiElement);
    await wait(async () => {
      const propertyText = await findByText('Test Property');
      expect(propertyText).toBeInTheDocument();
    });
  });

  it('concatenates the address and admin area', async () => {
    mockAxios.onAny().reply(200, { items: [mockFlatProperty] });
    const { findByText } = render(uiElement);
    await wait(async () => {
      const propertyText = await findByText('1234 Test St, Victoria');
      expect(propertyText).toBeInTheDocument();
    });
  });
  it('displays all associated projects', async () => {
    const propertyWithProjects = {
      ...mockFlatProperty,
      projectNumbers: ['SPP-10000', 'SPP-10001'],
    };
    mockAxios.onAny().reply(200, { items: [propertyWithProjects] });
    const { findByText } = render(uiElement);
    await wait(async () => {
      const projectOneText = await findByText('SPP-10000');
      const projectTwoText = await findByText('SPP-10001');
      expect(projectOneText).toBeInTheDocument();
      expect(projectOneText).toHaveAttribute('href', '/projects?projectNumber=SPP-10000');
      expect(projectTwoText).toBeInTheDocument();
      expect(projectTwoText).toHaveAttribute('href', '/projects?projectNumber=SPP-10001');
    });
  });
  it('allows properties to be added to the project', async () => {
    mockAxios.onAny().reply(200, { items: [mockFlatProperty] });
    const { findByTestId, findByText, findAllByText, getByText } = render(uiElement);
    await wait(async () => {
      const selectRowCheck = await findByTestId('selectrow-0');
      fireEvent.click(selectRowCheck);
    });
    const addToProjectBtn = await findByText('Add To Project');
    fireEvent.click(addToProjectBtn);
    const propertyNameText = await findAllByText('Test Property');
    const selectedText = getByText('1 Selected');
    expect(selectedText).toBeInTheDocument();
    expect(propertyNameText).toHaveLength(2);
  });
  it('requests a new page of data when a paging button is pressed', async () => {
    mockAxios.onAny().reply(200, { items: [mockFlatProperty], total: 6 });
    const { findByText, getByLabelText } = render(uiElement);
    await findByText('Test Property');
    const pageButton = getByLabelText('Page 2');
    fireEvent.click(pageButton);
    await wait(async () => {
      expect(mockAxios.history.get.length).toBe(2);
      expect(mockAxios.history.get[1].url).toMatch(/page=2/);
    });
  });
  it('selected properties are maintained even if the page changes.', async () => {
    mockAxios.onAny().reply(200, { items: [mockFlatProperty], total: 6 });
    const { findByTestId, findByText, findAllByText, getByLabelText, getByText } = render(
      uiElement,
    );

    //select a property
    const selectRowCheck = await findByTestId('selectrow-0');
    fireEvent.click(selectRowCheck);
    //change the page (with the property still selected)
    const pageButton = getByLabelText('Page 2');
    fireEvent.click(pageButton);
    //add all selected properties to the project.
    const addToProjectBtn = await findByText('Add To Project');
    fireEvent.click(addToProjectBtn);
    //ensure that the property is in both tables.
    const propertyNameText = await findAllByText('Test Property');
    const selectedText = getByText('1 Selected');
    expect(selectedText).toBeInTheDocument();
    expect(propertyNameText).toHaveLength(2);
  });

  it('selected properties are still checked even if the page changes.', async () => {
    mockAxios.onAny().reply(200, { items: [{ ...mockFlatProperty, id: 1 }], total: 6 });
    const { findByTestId, getByLabelText } = render(uiElement);

    //select a property
    let selectRowCheck = await findByTestId('selectrow-1');
    fireEvent.click(selectRowCheck);
    //change the page (with the property still selected)
    let pageButton = getByLabelText('Page 2');
    fireEvent.click(pageButton);
    //change back to page 1.
    pageButton = getByLabelText('Page 1');
    fireEvent.click(pageButton);
    //ensure that the property is in both tables.
    selectRowCheck = await findByTestId('selectrow-1');
    await wait(async () => {
      expect(selectRowCheck).toHaveAttribute('checked', '');
    });
  });

  it('selected properties can be removed', async () => {
    mockAxios.onAny().reply(200, { items: [mockFlatProperty] });
    const { findByTestId, findByText, findAllByText, getByTitle } = render(uiElement);
    await wait(async () => {
      const selectRowCheck = await findByTestId('selectrow-0');
      fireEvent.click(selectRowCheck);
    });
    const addToProjectBtn = await findByText('Add To Project');
    fireEvent.click(addToProjectBtn);
    const removeButton = getByTitle('Click to remove from project');
    fireEvent.click(removeButton);

    const propertyNameText = await findAllByText('Test Property');
    expect(propertyNameText).toHaveLength(1);
  });
});
