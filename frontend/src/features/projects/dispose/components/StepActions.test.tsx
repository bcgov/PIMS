import React from 'react';
import renderer from 'react-test-renderer';
import { StepActions } from './StepActions';
import { noop } from 'lodash';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

const mockStore = configureMockStore([thunk]);
const store = mockStore({ project: {}, projectWorkflow: [] });
const history = createMemoryHistory();

const renderComponent = (nextDisabled?: boolean, saveDisabled?: boolean) => {
  return renderer.create(
    <Provider store={store}>
      <Router history={history}>
        <StepActions
          onNext={noop}
          onSave={noop}
          nextDisabled={nextDisabled}
          saveDisabled={saveDisabled}
        />
      </Router>
    </Provider>,
  );
};

describe('Approval Confirmation', () => {
  //TODO: uncommenting either of these causes npm test to crash.
  xit('Matches Snapshot', () => {
    const component = renderComponent();
    expect(component.toJSON()).toMatchSnapshot();
  });

  xit('Action buttons are disabled', () => {
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
