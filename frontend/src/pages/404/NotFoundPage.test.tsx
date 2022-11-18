import { createMemoryHistory } from 'history';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';

import { NotFoundPage } from './NotFoundPage';

const history = createMemoryHistory();

describe('NotFoundPage', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <MemoryRouter initialEntries={[history.location]}>
          <NotFoundPage />
        </MemoryRouter>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
