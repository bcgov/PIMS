import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { noop } from 'lodash';
import React from 'react';
import renderer from 'react-test-renderer';

import { StepActions } from './StepActions';

jest.mock('hooks/useKeycloakWrapper');
(useKeycloakWrapper as jest.Mock).mockReturnValue({ hasClaim: () => true });

const renderComponent = (
  nextDisabled?: boolean,
  saveDisabled?: boolean,
  getNextStep?: Function,
) => {
  return renderer.create(
    <StepActions
      onNext={noop}
      onSave={noop}
      nextDisabled={nextDisabled}
      saveDisabled={saveDisabled}
      getNextStep={getNextStep}
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

  it('Next & Save buttons are disabled if permission missing on milestone steps', () => {
    (useKeycloakWrapper as jest.Mock).mockReturnValue({ hasClaim: () => false });
    const component = renderComponent(false, false, () => ({
      isMilestone: true,
    }));
    const buttons = component.root.findAllByType('button');
    expect(buttons[0].props.disabled).toBeTruthy();
    expect(buttons[0].props.disabled).toBeTruthy();
  });
});
