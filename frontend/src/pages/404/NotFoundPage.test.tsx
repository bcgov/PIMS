import React from 'react';
import renderer from 'react-test-renderer';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { NotFoundPage } from './NotFoundPage';

const history = createMemoryHistory();

describe('NotFoundPage', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <Router history={history}>
          <NotFoundPage />
        </Router>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
