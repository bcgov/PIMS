import React from 'react';
import * as MOCK from 'mocks/filterDataMock';
import { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import MapFilterBar from './MapFilterBar';
import LookupCodeDropdown from 'components/common/LookupCodeDropdown';
import renderer from 'react-test-renderer';

Enzyme.configure({ adapter: new Adapter() });

const handleFilterChanged = jest.fn();

const filterBar = shallow(
  <MapFilterBar
    agencyLookupCodes={MOCK.AGENCIES}
    propertyClassifications={MOCK.CLASSIFICATIONS}
    onFilterChange={handleFilterChanged}
    lotSizes={[]}
  />,
);

// Capture any changes
it('MapFilterBar renders correctly', () => {
  const tree = renderer
    .create(
      <MapFilterBar
        agencyLookupCodes={MOCK.AGENCIES}
        propertyClassifications={MOCK.CLASSIFICATIONS}
        onFilterChange={handleFilterChanged}
        lotSizes={[]}
      />,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
