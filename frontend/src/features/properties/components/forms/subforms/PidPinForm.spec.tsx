import { cleanup, render } from '@testing-library/react';
import { IParcel } from 'actions/parcelsActions';
import { Form, Formik } from 'formik';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import React from 'react';
import renderer from 'react-test-renderer';
import { fillInput } from 'utils/testUtils';
import * as Vitest from 'vitest';
import { vi } from 'vitest';

import PidPinForm from './PidPinForm';

vi.mock('lodash/debounce', () => vi.fn(fn => fn));
vi.mock('hooks/useKeycloakWrapper');
(useKeycloakWrapper as Vitest.Mock).mockReturnValue({ hasClaim: () => true });

describe('PidPin sub-form', () => {
  let form: JSX.Element;
  let handlePidChange = vi.fn();
  let handlePinChange = vi.fn();
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
    vi.clearAllMocks();
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
