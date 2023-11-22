import { render } from '@testing-library/react';
import React from 'react';

import { Instructions } from './Instructions';

describe('Testing Instructions section for CSV Upload', () => {
  const { getByText } = render(<Instructions />);

  it('Expected dialogue appears on page', () => {
    expect(getByText(/Upload Instructions/)).toBeInTheDocument();
    expect(getByText(/Steps/)).toBeInTheDocument();
    expect(getByText(/Requirements/)).toBeInTheDocument();
  });
});
