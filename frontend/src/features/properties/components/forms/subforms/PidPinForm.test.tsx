import { cleanup, render } from '@testing-library/react';
import { IParcel } from 'actions/parcelsActions';
import { Form, Formik } from 'formik';
import useKeycloakWrapper, { IKeycloak } from 'hooks/useKeycloakWrapper';
import React from 'react';
import renderer from 'react-test-renderer';
import { fillInput } from 'utils/testUtils';

import PidPinForm from './PidPinForm';

jest.mock('lodash/debounce', () => jest.fn((fn) => fn));
jest.mock('hooks/useKeycloakWrapper');
(useKeycloakWrapper as jest.Mock<Partial<IKeycloak>>).mockReturnValue({ hasClaim: () => true });

describe('PidPin sub-form', () => {
  beforeAll(() => {
    (global as any).IS_REACT_ACT_ENVIRONMENT = false;
  });
  let form: JSX.Element;
  const handlePidChange = jest.fn();
  const handlePinChange = jest.fn();
  beforeEach(() => {
    form = (
      <Formik<Partial<IParcel>>
        initialValues={{ pid: '', pin: '', projectNumbers: [] }}
        initialTouched={{ pid: true, pin: true }}
        validateOnChange={false}
        onSubmit={() => {}}
      >
        {() => (
          <Form>
            <PidPinForm handlePidChange={handlePidChange} handlePinChange={handlePinChange} />
          </Form>
        )}
      </Formik>
    );
  });
  afterEach(() => {
    handlePinChange.mockReset();
    handlePidChange.mockReset();
    cleanup();
  });
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const tree = renderer.create(form).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('formats PID values', async () => {
    const { container } = render(form);
    const { input } = fillInput(container, 'pid', '123456789');
    expect(input).toHaveValue('123-456-789');
  });
});
