import { render } from '@testing-library/react';
import BugForm from 'features/help/forms/BugForm';
import React from 'react';

describe('Testing BugForm.tsx', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  it('Form renders with all expected text', () => {
    const { getByText } = render(
      <BugForm
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
    expect(getByText('Page')).toBeInTheDocument();
    expect(getByText('Steps to Reproduce')).toBeInTheDocument();
    expect(getByText('Expected Result')).toBeInTheDocument();
    expect(getByText('Actual Result')).toBeInTheDocument();
  });
});
