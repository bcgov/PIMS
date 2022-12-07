import { useKeycloak } from '@react-keycloak/web';
import { render, screen } from '@testing-library/react';
import Claims from 'constants/claims';
import { LayoutWrapper } from 'features/projects/common';
import { createMemoryHistory } from 'history';
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';

const history = createMemoryHistory();

jest.mock('@react-keycloak/web');
const mockKeycloak = (claims: string[]) => {
  (useKeycloak as jest.Mock).mockReturnValue({
    keycloak: {
      userInfo: {
        agencies: [1],
        roles: claims,
      },
      subject: 'test',
      authenticated: true,
    },
  });
};

describe('Layout Wrapper', () => {
  beforeAll(() => {
    mockKeycloak([Claims.PROPERTY_VIEW]);
  });

  it('Document title is updated', () => {
    const title = 'PIMS - Test Title';
    const container = document.createElement('div');
    document.body.appendChild(container);
    act(() => {
      ReactDOM.render(
        <MemoryRouter initialEntries={[history.location]}>
          <LayoutWrapper component={() => <p>Title Test Page</p>} title={title} />
        </MemoryRouter>,
        container,
      );
    });

    expect(document.title).toBe('PIMS - Test Title');
  });

  it('Document renders child', () => {
    render(
      <MemoryRouter initialEntries={[history.location]}>
        <LayoutWrapper component={() => <p data-testid="test-page"></p>} />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('test-page'));
  });
});
