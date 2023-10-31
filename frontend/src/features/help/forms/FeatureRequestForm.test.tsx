import { render } from '@testing-library/react';
import FeatureRequestForm from 'features/help/forms/FeatureRequestForm';
import React from 'react';

describe('Testing FeatureRequestForm.tsx', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  it('Form renders with all expected text', () => {
    const { getByText } = render(
      <FeatureRequestForm
        setMailto={() => undefined}
        formValues={{
          user: 'Tester',
          email: 'test@netscape.com',
          page: 'Test Page',
        }}
      />,
    );
    expect(getByText('User')).toBeInTheDocument();
    expect(getByText('Email')).toBeInTheDocument();
    expect(getByText('Description')).toBeInTheDocument();
  });
});
