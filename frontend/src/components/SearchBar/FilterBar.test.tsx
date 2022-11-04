import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';
import React from 'react';
import { create } from 'react-test-renderer';

import FilterBar from './FilterBar';

Enzyme.configure({ adapter: new Adapter() });

const componentRender = () => {
  let component = create(
    <div>
      <FilterBar initialValues={{ username: 'test', firstName: 'user' }} onChange={() => {}} />
    </div>,
  );
  return component;
};

describe('Filter Bar', () => {
  it('Snapshot matches', () => {
    const component = componentRender();
    expect(component.toJSON()).toMatchSnapshot();
  });
});
