import { create } from 'react-test-renderer';
import React from 'react';
import BaseLayout from '@/components/layout/BaseLayout';

describe('BaseLayout.tsx', () => {
  it('should match the existing snapshot', () => {
    const tree = create(
      <BaseLayout>
        <p>The child.</p>
      </BaseLayout>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
