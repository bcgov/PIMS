import React from 'react';
import AppRoute from './AppRoute';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

const history = createMemoryHistory();

describe('App Route', () => {
  it('Document title is updated', () => {
    const title = 'PIMS - Test Title';
    const container = document.createElement('div');
    document.body.appendChild(container);
    act(() => {
      ReactDOM.render(
        <Router history={history}>
          <AppRoute component={() => <p>Title Test Page</p>} title={title} />
        </Router>,
        container,
      );
    });

    expect(document.title).toBe('PIMS - Test Title');
  });
});
