import { create } from 'react-test-renderer';
import React from 'react';
import Footer from '@/components/layout/Footer';

jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useTheme: () => ({
    palette: {
      gray: {
        main: '#FFFFFF',
      },
    },
  }),
}));

describe('Footer.tsx', () => {
  it('should match the existing snapshot', () => {
    const tree = create(<Footer />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
