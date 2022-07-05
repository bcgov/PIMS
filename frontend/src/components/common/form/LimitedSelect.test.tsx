import { mount } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { getIn, useFormikContext } from 'formik';
import React from 'react';
import renderer from 'react-test-renderer';

import { FastSelect } from './FastSelect';

jest.mock('formik');
Enzyme.configure({ adapter: new Adapter() });

(useFormikContext as jest.Mock).mockReturnValue({
  values: {
    classificationId: 0,
    classification: 'zero',
  },
  registerField: jest.fn(),
  unregisterField: jest.fn(),
});
(getIn as jest.Mock).mockReturnValue(0);

const options = [
  {
    label: 'zero',
    value: '0',
    selected: true,
  },
  {
    label: 'one',
    value: '1',
    selected: true,
  },
  {
    label: 'two',
    value: '2',
    selected: true,
  },
];

it('limited fast select renders correctly', () => {
  const context = useFormikContext();
  const tree = renderer
    .create(
      <FastSelect
        limitLabels={['one']}
        formikProps={context}
        type="number"
        options={options}
        field={'TestField'}
      />,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('only renders the limited options + the previous value', async () => {
  const context = useFormikContext();
  const component = mount(
    <FastSelect
      limitLabels={['one']}
      formikProps={context}
      type="number"
      options={options}
      field={'TestField'}
    />,
  );
  expect(component.find('option')).toHaveLength(2);
});
