import React from 'react';
import renderer from 'react-test-renderer';
import { Formik } from 'formik';
import { Form } from 'react-bootstrap';
import { noop } from 'lodash';

const renderComponent = (checked: boolean) => {
  //const userDisplayName = 'PIMS User';
  const fieldName = 'confirmation';
  return renderer.create(
    <Formik initialValues={{ [fieldName]: checked }} onSubmit={() => {}}>
      <Form>
        {/* <ApprovalConfirmationCheckbox
          field={fieldName}
          onChange={onChange}
          userDisplayName={userDisplayName}
        /> */}
      </Form>
    </Formik>,
  );
};

describe('Approval Confirmation', () => {
  xit('Matches Snapshot', () => {
    const component = renderComponent(false, noop);
    expect(component.toJSON()).toMatchSnapshot();
  });

  //TODO: update after form refactor.
  xit('Input is checked', () => {
    const component = renderComponent(true, noop);
    expect(component.root.findByType('input').props.checked).toBeTruthy();
  });

  xit('Input is not checked', () => {
    const component = renderComponent(false, noop);
    expect(component.root.findByType('input').props.checked).toBeFalsy();
  });
});
