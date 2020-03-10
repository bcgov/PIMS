import * as MOCK from 'mocks/filterDataMock';
import LookupCodeDropdown from './LookupCodeDropdown';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import { Dropdown, DropdownButton } from 'react-bootstrap';

Enzyme.configure({ adapter: new Adapter() });

it('LookupCodeDropdown renders correctly', () => {
  const tree = renderer
    .create(
      <LookupCodeDropdown
        lookupCodes={MOCK.CLASSIFICATIONS}
        defaultTitle={'View by Classification \u00A0'}
        onSelectCode={jest.fn()}
      />,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

// Check items being displayed in dropdown before filter tests
let classificationDropdown = shallow(
  <LookupCodeDropdown
    lookupCodes={MOCK.CLASSIFICATIONS}
    defaultTitle={'View by Classification \u00A0'}
    onSelectCode={jest.fn()}
  />,
);
it('Displays item for all classifications given', () => {
  const items = classificationDropdown.find(Dropdown.Item);
  expect(items.length).toBe(5);
});

let agencyDropdown = shallow(
  <LookupCodeDropdown
    lookupCodes={MOCK.AGENCIES}
    defaultTitle={'View by Agency \u00A0'}
    onSelectCode={jest.fn()}
  />,
);
it('Displays item for all agencies given', () => {
  const items = agencyDropdown.find(Dropdown.Item);
  expect(items.length).toBe(6);
});

// Should isDisabled items be hidden from dropdown? Will fail in current implementation
// it('Does not display item in dropdown list if it is disabled', () => {
//     let disabledDropdown = shallow(<LookupCodeDropdown lookupCodes={MOCK.DISABLED} defaultTitle={"View by Classification \u00A0"} onSelectCode={jest.fn()} />)
//     expect(disabledDropdown.find(Dropdown.Item).length).toBe(2);
// });

// Ensure that when item is selected appropriate function is called
it('Calls onSelect function when item is selected', () => {
  const onSelectAgencies = jest.fn();
  let dropdown = shallow(
    <LookupCodeDropdown
      lookupCodes={MOCK.AGENCIES}
      defaultTitle={'View by Agency \u00A0'}
      onSelectCode={onSelectAgencies}
    />,
  );
  const dropdownButton = dropdown.find(DropdownButton);
  dropdownButton.simulate('select', { eventKey: '1' });
  expect(onSelectAgencies).toBeCalledTimes(1);
});
