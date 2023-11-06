import Adapter from '@cfaester/enzyme-adapter-react-18';
import { ILookupCode } from 'actions/ILookupCode';
import FindMorePropertiesForm from 'components/SearchBar/FindMorePropertiesForm';
import * as API from 'constants/API';
import Claims from 'constants/claims';
import Enzyme from 'enzyme';
import { getIn, useFormikContext } from 'formik';
import { createMemoryHistory } from 'history';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import useKeycloakMock from 'useKeycloakWrapperMock';

const userRoles: string[] | Claims[] = [];
const userAgencies: number[] = [1];
const userAgency: number = 1;

jest.mock('hooks/useKeycloakWrapper');
(useKeycloakWrapper as jest.Mock).mockReturnValue(
  new (useKeycloakMock as any)(userRoles, userAgencies, userAgency),
);

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

const mockStore = configureMockStore([thunk]);
const history = createMemoryHistory();

const lCodes = {
  lookupCodes: [
    { name: 'agencyVal', id: '1', isDisabled: false, type: API.AGENCY_CODE_SET_NAME },
    { name: 'disabledAgency', id: '2', isDisabled: true, type: API.AGENCY_CODE_SET_NAME },
  ] as ILookupCode[],
};

const selectedUser = {
  username: 'tester',
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'test@test.com',
  isDisabled: false,
  emailVerified: false,
  agencies: [1],
  roles: [],
  rowVersion: 'AAAAAAAAB9E=',
  note: 'test note',
  lastLogin: '2023-02-28T17:45:39.7381599',
};

const store = mockStore({
  users: { user: selectedUser },
  lookupCode: lCodes,
});

it('limited fast select renders correctly', () => {
  // const context = useFormikContext();
  const tree = renderer
    .create(
      <Provider store={store}>
        <MemoryRouter initialEntries={[history.location]}>
          <FindMorePropertiesForm />
        </MemoryRouter>
      </Provider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
