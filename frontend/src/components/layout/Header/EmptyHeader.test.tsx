import { render } from '@testing-library/react';
import React from 'react';

import EmptyHeader from './EmptyHeader';

describe('Empty Header', () => {
  it('renders', () => {
    const { container } = render(<EmptyHeader></EmptyHeader>);
    expect(container.firstChild).toMatchSnapshot();
  });
});
