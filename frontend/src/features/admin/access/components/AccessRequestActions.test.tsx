import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { AccessRequestActions } from './AccessRequestActions';

const mockStore = configureMockStore([thunk]);
const store = mockStore({});

describe('AccessRequestActions', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <AccessRequestActions selections={[]} />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
