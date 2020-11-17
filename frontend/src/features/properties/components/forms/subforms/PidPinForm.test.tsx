import React from 'react';
import renderer from 'react-test-renderer';
import { render, cleanup } from '@testing-library/react';
import PidPinForm from './PidPinForm';
import useKeycloakWrapper, { IKeycloak } from 'hooks/useKeycloakWrapper';
import { Formik, Form } from 'formik';
import { fillInput } from 'utils/testUtils';
import { IParcel } from 'actions/parcelsActions';

jest.mock('lodash/debounce', () => jest.fn(fn => fn));
jest.mock('hooks/useKeycloakWrapper');
(useKeycloakWrapper as jest.Mock<Partial<IKeycloak>>).mockReturnValue({ hasClaim: () => true });

describe('PidPin sub-form', () => {
  let form: JSX.Element;
  let handlePidChange = jest.fn();
  let handlePinChange = jest.fn();
  beforeEach(() => {
    form = (
      <Formik<Partial<IParcel>>
        initialValues={{ pid: '', pin: '', projectNumber: '' }}
        initialTouched={{ pid: true, pin: true }}
        validateOnChange={false}
        onSubmit={() => {}}
      >
        {formikProps => (
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
    const { input } = await fillInput(container, 'pid', '123456789');
    expect(input).toHaveValue('123-456-789');
  });
});
