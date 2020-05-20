import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import FilterBar from './FilterBar';
import { create } from 'react-test-renderer';

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
