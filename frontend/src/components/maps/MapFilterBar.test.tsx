import React from 'react';
import * as MOCK from 'mocks/filterDataMock';
import { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import MapFilterBar from './MapFilterBar';
import LookupCodeDropdown from 'components/common/LookupCodeDropdown';
import renderer from 'react-test-renderer';

Enzyme.configure({ adapter: new Adapter() });

const onFilterChange = jest.fn();

const filterBar = shallow(
  <MapFilterBar
    agencyLookupCodes={MOCK.AGENCIES}
    propertyClassifications={MOCK.CLASSIFICATIONS}
    lotSizes={[1, 2, 5, 10, 50]}
    onFilterChange={onFilterChange}
  />,
);

// ----
// TODO: Fix unit tests below as the <MapFilterBar> internals have changed drastically
// ----

// Could change as project progresses
xit('Currently has 2 drop downs, one for agency one for classifications', () => {
  const numberOfDropdowns = filterBar.find(LookupCodeDropdown).length;
  expect(numberOfDropdowns).toBe(2);
});

// Check function is called when agency is changed
xit('Handles the agency change when code selected from the drop down', () => {
  const agencyDropdown = filterBar.find({ defaultTitle: 'View Properties in \u00A0' });
  agencyDropdown.prop('onSelectCode')();
  expect(onFilterChange).toBeCalledTimes(1);
});

// Check function is called when classification selected
xit('Handles the classification change when code selected from the drop down', () => {
  const classificationDropdown = filterBar.find({ defaultTitle: 'View by Classification \u00A0' });
  classificationDropdown.prop('onSelectCode')();
  expect(onFilterChange).toHaveBeenCalledTimes(1);
});

// Capture any changes
it('MapFilterBar renders correctly', () => {
  const tree = renderer
    .create(
      <MapFilterBar
        agencyLookupCodes={MOCK.AGENCIES}
        propertyClassifications={MOCK.CLASSIFICATIONS}
        lotSizes={[1, 2, 3]}
        onFilterChange={onFilterChange}
      />,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
