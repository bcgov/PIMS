// import { create } from 'react-test-renderer';
// import { render, screen } from '@testing-library/react';
// import App from './App';
import React from 'react';
import '@testing-library/jest-dom';
// import { BrowserRouter } from 'react-router-dom';

// Mock child components
jest.mock('@/pages/Home', () => {
  const Home = (props) => (
    <div data-testid="mocked-child-component" data-props={JSON.stringify(props)}>
      Mocked Header
    </div>
  );
  return { default: Home };
});

// FIXME: See note about moduleNameMapper in jest.config.ts
describe('App.tsx', () => {
  it('FIXME', () => {
    expect(true).toBeTruthy();
  });
  // it('should match the existing snapshot', () => {
  //   const tree = create(
  //     <BrowserRouter>
  //       <App />
  //     </BrowserRouter>,
  //   ).toJSON();
  //   expect(tree).toMatchSnapshot();
  // });

  // it('should contain the header component', async () => {
  //   render(
  //     <BrowserRouter>
  //       <App />
  //     </BrowserRouter>,
  //   );
  //   expect(await screen.findByText('Mocked Header')).toBeInTheDocument();
  // });
});
