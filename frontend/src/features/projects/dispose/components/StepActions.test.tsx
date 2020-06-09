import React from 'react';
import renderer from 'react-test-renderer';
import { StepActions } from './StepActions';
import { noop } from 'lodash';

const renderComponent = (nextDisabled?: boolean, saveDisabled?: boolean) => {
  return renderer.create(
    <StepActions
      onNext={noop}
      onSave={noop}
      nextDisabled={nextDisabled}
      saveDisabled={saveDisabled}
    />,
  );
};

describe('Approval Confirmation', () => {
  it('Matches Snapshot', () => {
    const component = renderComponent();
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('Action buttons are disabled', () => {
    const component = renderComponent(true, true);
    const buttons = component.root.findAllByType('button');
    expect(buttons[0].props.disabled).toBeTruthy();
    expect(buttons[1].props.disabled).toBeTruthy();
  });

  it('Action buttons are not disabled', () => {
    const component = renderComponent(false, false);
    const buttons = component.root.findAllByType('button');
    expect(buttons[0].props.disabled).toBeFalsy();
    expect(buttons[1].props.disabled).toBeFalsy();
  });
});
