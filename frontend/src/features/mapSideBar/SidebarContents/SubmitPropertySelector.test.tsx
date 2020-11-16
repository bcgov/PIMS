import React from 'react';
import renderer from 'react-test-renderer';
import SubmitPropertySelector from './SubmitPropertySelector';
import noop from 'lodash/noop';

describe('SubmitPropertySelector', () => {
  it('component renders correctly', () => {
    const tree = renderer
      .create(<SubmitPropertySelector addBuilding={noop} addRawLand={noop} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
