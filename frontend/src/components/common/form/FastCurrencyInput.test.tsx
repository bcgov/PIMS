import React from 'react';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import { Formik, Form } from 'formik';
import { FastCurrencyInput } from './FastCurrencyInput';
import { render } from '@testing-library/react';
import { noop } from 'lodash';

Enzyme.configure({ adapter: new Adapter() });

describe('FastCurrencyInput', () => {
  it('fast currency input renders correctly', () => {
    const tree = renderer
      .create(
        <Formik initialValues={{ assessed: '' }} onSubmit={noop}>
          {props => (
            <Form>
              <FastCurrencyInput formikProps={props} field={'assessed'} tooltip={'Tooltip'} />
            </Form>
          )}
        </Formik>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('fast currency input should not show tooltip', () => {
    const { container } = render(
      <Formik initialValues={{ assessed: '' }} onSubmit={noop}>
        {props => (
          <Form>
            <FastCurrencyInput formikProps={props} field={'assessed'} />
          </Form>
        )}
      </Formik>,
    );

    expect(container.querySelector('svg[className="tooltip-icon"]')).toBeFalsy();
  });

  it('fast currency input should show tooltip', () => {
    const { container } = render(
      <Formik initialValues={{ assessed: '' }} onSubmit={noop}>
        {props => (
          <Form>
            <FastCurrencyInput formikProps={props} field={'assessed'} tooltip="Test tooltip" />
          </Form>
        )}
      </Formik>,
    );

    expect(container.querySelector('svg[className="tooltip-icon"]'));
  });

  it('fast currency input custom placeholder', () => {
    const component = render(
      <Formik initialValues={{ assessed: '' }} onSubmit={noop}>
        {props => (
          <Form>
            <FastCurrencyInput
              formikProps={props}
              field={'assessed'}
              tooltip="Test tooltip"
              placeholder="custom placeholder"
            />
          </Form>
        )}
      </Formik>,
    );

    expect(component.findByPlaceholderText('custom placeholder'));
  });
});
