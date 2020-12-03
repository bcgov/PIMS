import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import { Formik, Form } from 'formik';
import { noop } from 'lodash';
import { AutoCompleteText } from './AutoCompleteText';
import { SelectOption } from './Select';

import { render } from '@testing-library/react';

Enzyme.configure({ adapter: new Adapter() });

describe('Auto Complete Text', () => {
  it('component renders correctly', () => {
    const { container } = render(
      <Formik initialValues={{ city: 300 }} onSubmit={noop}>
        {() => (
          <Form>
            <AutoCompleteText
              getValueDisplay={(val: SelectOption) => val.label}
              field="city"
              options={[
                { value: 300, label: 'Victoria' },
                { value: 400, label: 'Vancouver' },
              ]}
            />
          </Form>
        )}
      </Formik>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
