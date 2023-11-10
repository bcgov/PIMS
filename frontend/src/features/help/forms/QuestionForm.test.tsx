import { render } from '@testing-library/react';
import QuestionForm from 'features/help/forms/QuestionForm';
import React from 'react';

describe('Testing BugForm.tsx', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  it('Form renders with all expected text', () => {
    const { getByText } = render(
      <QuestionForm
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
    expect(getByText('Question')).toBeInTheDocument();
  });
});
