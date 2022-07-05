import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { create } from 'react-test-renderer';

import FilterBar from './FilterBar';

Enzyme.configure({ adapter: new Adapter() });

const componentRender = () => {
  let component = create(
    <div>
      <FilterBar
        initialValues={{ username: 'test', firstName: 'user' }}
        onReset={() => {}}
        onSearch={() => {}}
      />
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
