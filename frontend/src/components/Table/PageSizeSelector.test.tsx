import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import { TablePageSizeSelector } from './PageSizeSelector';
import { create } from 'react-test-renderer';

Enzyme.configure({ adapter: new Adapter() });

const componentRender = () => {
  let component = create(
    <div>
      <TablePageSizeSelector value={1} options={[1, 2, 3, 4, 5]} onChange={() => {}} />
    </div>,
  );
  return component;
};

describe('Page size selector', () => {
  it('Snapshot matches', () => {
    const component = componentRender();
    expect(component.toJSON()).toMatchSnapshot();
  });
});
