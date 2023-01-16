import { render } from '@testing-library/react';
import React from 'react';

import LoginLoading from './LoginLoading';

describe('Empty Header', () => {
  it('renders', () => {
    const { container } = render(<LoginLoading></LoginLoading>);
    expect(container.firstChild).toMatchSnapshot();
  });
});
