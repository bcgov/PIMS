import React from 'react';
import * as MOCK from 'mocks/filterDataMock';
import { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import MapFilterBar from './MapFilterBar';
import LookupCodeDropdown from 'components/common/LookupCodeDropdown';
import renderer from 'react-test-renderer';

Enzyme.configure({ adapter: new Adapter() });

const handleAgencyChanged = jest.fn();
const handlePropertyClassificationChanged = jest.fn();

const filterBar = shallow(
  <MapFilterBar
    agencyLookupCodes={MOCK.AGENCIES}
    propertyClassifications={MOCK.CLASSIFICATIONS}
    onSelectAgency={handleAgencyChanged}
    onSelectPropertyClassification={handlePropertyClassificationChanged}
  />,
);

// Could change as project progresses
it('Currently has 2 drop downs, one for agency one for classifications', () => {
  const numberOfDropdowns = filterBar.find(LookupCodeDropdown).length;
  expect(numberOfDropdowns).toBe(2);
});

// Check function is called when agency is changed
it('Handles the agency change when code selected from the drop down', () => {
  const agencyDropdown = filterBar.find({ defaultTitle: 'View Properties in \u00A0' });
  agencyDropdown.prop('onSelectCode')();
  expect(handleAgencyChanged).toBeCalledTimes(1);
});

// Check function is called when classification selected
it('Handles the classification change when code selected from the drop down', () => {
  const classificationDropdown = filterBar.find({ defaultTitle: 'View by Classification \u00A0' });
  classificationDropdown.prop('onSelectCode')();
  expect(handlePropertyClassificationChanged).toHaveBeenCalledTimes(1);
});

// Capture any changes
it('MapFilterBar renders correctly', () => {
  const tree = renderer
    .create(
      <MapFilterBar
        agencyLookupCodes={MOCK.AGENCIES}
        propertyClassifications={MOCK.CLASSIFICATIONS}
        onSelectAgency={handleAgencyChanged}
        onSelectPropertyClassification={handlePropertyClassificationChanged}
      />,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
