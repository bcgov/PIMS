import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';
import React from 'react';
import { create } from 'react-test-renderer';

import { TablePageSizeSelector } from './PageSizeSelector';

Enzyme.configure({ adapter: new Adapter() });

const componentRender = () => {
  let component = create(
    <div>
      <TablePageSizeSelector
        value={1}
        options={[1, 2, 3, 4, 5]}
        onChange={() => {}}
        alignTop={false}
      />
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
