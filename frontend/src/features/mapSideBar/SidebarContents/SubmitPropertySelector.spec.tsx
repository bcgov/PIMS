import noop from 'lodash/noop';
import React from 'react';
import renderer from 'react-test-renderer';

import SubmitPropertySelector from './SubmitPropertySelector';

describe('SubmitPropertySelector', () => {
  it('component renders correctly', () => {
    const tree = renderer
      .create(
        <SubmitPropertySelector addSubdivision={noop} addBuilding={noop} addBareLand={noop} />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
