import React from 'react';
import renderer from 'react-test-renderer';
import { noop } from 'lodash';
import SppButton from './SppButton';

describe('SPP Button', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<SppButton handleErpClick={noop} handleSppClick={noop} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
