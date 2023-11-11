import { render, waitFor } from '@testing-library/react';
import Claims from 'constants/claims';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import React from 'react';
import useKeycloakMock from 'useKeycloakWrapperMock';

import { AssociatedLandReviewPage } from './AssociatedLandReviewPage';

const agencies = ['Victoria'];
const classifications = ['Core Strategic'];

const userRoles: string[] | Claims[] = ['admin-properties'];
const userAgencies: number[] = [1, 2];
const userAgency: number = 1;

jest.mock('hooks/useKeycloakWrapper');
(useKeycloakWrapper as jest.Mock).mockReturnValue(
  new (useKeycloakMock as any)(userRoles, userAgencies, userAgency),
);

const getElement = (disabled: boolean) => {
  return (
    <AssociatedLandReviewPage
      disabled={disabled}
      nameSpace={`data.parcels`}
      classifications={classifications}
      agencies={agencies}
    />
  );
};

describe('AssociatedLandReviewPage', () => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  const { container, getByText } = render(getElement(false));
  it('renders correctly', () => {
    expect(container.firstChild).toMatchSnapshot();
  });

  it('contains expected header', () => {
    waitFor(() => getByText(/Review associated land information/i));
  });
});
