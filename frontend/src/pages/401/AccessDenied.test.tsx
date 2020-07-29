import React from 'react';
import renderer from 'react-test-renderer';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import AccessDenied from './AccessDenied';

const history = createMemoryHistory();

describe('AccessDenied', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <Router history={history}>
          <AccessDenied />
        </Router>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
