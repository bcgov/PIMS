import { render } from '@testing-library/react';
import React from 'react';

import EmptyLayout from './EmptyLayout';

describe('Empty Layout', () => {
  it('renders', () => {
    const { container } = render(<EmptyLayout></EmptyLayout>);
    expect(container.firstChild).toMatchSnapshot();
  });
});
