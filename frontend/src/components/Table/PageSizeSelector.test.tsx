import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { create } from 'react-test-renderer';

import { TablePageSizeSelector } from './PageSizeSelector';

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
