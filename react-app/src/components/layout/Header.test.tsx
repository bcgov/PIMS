import { create } from 'react-test-renderer';
import React from 'react';
import Header from '@/components/layout/Header';

describe('Header.tsx', () => {
  it('should match the existing snapshot', () => {
    const tree = create(<Header />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
