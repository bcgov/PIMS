import { describe, expect, it } from '@jest/globals';
import { create } from 'react-test-renderer';
import { render, screen } from '@testing-library/react';
import App from './App';
import React from 'react';

// Mock child components
jest.mock('@/pages/Home', () => ({
  __esModule: true,
  ChildComponent: (props: any) => (
    <div data-testid="mocked-child-component" data-props={JSON.stringify(props)}>
      Mocked Header
    </div>
  ),
}));

describe('App.tsx', () => {
  it('should match the existing snapshot', () => {
    const tree = create(<App />).toJSON();
    expect(tree).toMatchInlineSnapshot();
  });

  it('should contain the header component', () => {
    render(<App />);
    expect(screen.findByText('Mocked Header')).toBeInTheDocument();
  });
});
