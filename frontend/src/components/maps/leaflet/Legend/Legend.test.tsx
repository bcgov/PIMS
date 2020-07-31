import React from 'react';
import renderer from 'react-test-renderer';
import { Legend } from './Legend';

describe('Map Legend View', () => {
  it('Legend renders correctly', () => {
    const tree = renderer.create(<Legend />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
