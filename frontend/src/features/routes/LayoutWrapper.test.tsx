import { render, screen } from '@testing-library/react';
import Claims from 'constants/claims';
import { LayoutWrapper } from 'features/routes';
import { createMemoryHistory } from 'history';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import useKeycloakMock from 'useKeycloakWrapperMock';

const history = createMemoryHistory();

const userAgencies: number[] = [1];
const userAgency: number = 1;

jest.mock('hooks/useKeycloakWrapper');
const mockKeycloak = (userRoles: string[] | Claims[]) => {
  (useKeycloakWrapper as jest.Mock).mockReturnValue(
    new (useKeycloakMock as any)(userRoles, userAgencies, userAgency),
  );
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
      render(
        <MemoryRouter initialEntries={[history.location]}>
          <LayoutWrapper component={() => <p>Title Test Page</p>} title={title} />
        </MemoryRouter>,
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
