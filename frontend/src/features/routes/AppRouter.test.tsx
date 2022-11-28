import { LayoutWrapper as AppRoute } from 'features/projects/common';
import { createMemoryHistory } from 'history';
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';

const history = createMemoryHistory();

describe('App Route', () => {
  it('Document title is updated', () => {
    const title = 'PIMS - Test Title';
    const container = document.createElement('div');
    document.body.appendChild(container);
    act(() => {
      ReactDOM.render(
        <MemoryRouter initialEntries={[history.location]}>
          <AppRoute component={() => <p>Title Test Page</p>} title={title} />
        </MemoryRouter>,
        container,
      );
    });

    expect(document.title).toBe('PIMS - Test Title');
  });
});
