import { create } from 'react-test-renderer';
import { AccessRequest } from '@/pages/AccessRequest';
import React from 'react';
import '@testing-library/jest-dom';

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  Controller: () => <></>,
  useForm: () => ({
    control: () => ({}),
    handleSubmit: () => jest.fn(),
  }),
  useFormContext: () => ({
    control: () => ({}),
    register: () => ({}),
  }),
}));

jest.mock('@bcgov/citz-imb-kc-react', () => ({
  useKeycloak: () => ({
    state: {
      userInfo: {
        idir_username: 'Test',
        given_name: 'Test',
        family_name: 'McTest',
        email: 'test@gov.bc.ca',
      },
    },
  }),
}));

describe('AccessRequest.tsx', () => {
  it('should match the existing snapshot', () => {
    const tree = create(<AccessRequest />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
