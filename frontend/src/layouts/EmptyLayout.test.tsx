import EmptyLayout from './EmptyLayout';
import { render } from '@testing-library/react';
import React from 'react';

describe('Empty Layout', () => {
  it('renders', () => {
    const { container } = render(<EmptyLayout></EmptyLayout>);
    expect(container.firstChild).toMatchSnapshot();
  });
});
