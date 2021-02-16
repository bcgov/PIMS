import React from 'react';
import renderer from 'react-test-renderer';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import { useKeycloak } from '@react-keycloak/web';
import { Claims } from 'constants/claims';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import _ from 'lodash';
import { cleanup } from '@testing-library/react-hooks';
import { getStore, mockProject as project } from '../../dispose/testUtils';
import { Classifications } from 'constants/classifications';
import { IProject, ReviewWorkflowStatus } from '../../common';
import { GreTransferStep } from '..';

jest.mock('@react-keycloak/web');
const mockProject: IProject = {
  ...project,
  statusCode: ReviewWorkflowStatus.OnHold,
  properties: [
    {
      id: 1,
      pid: '213-221-321',
      name: 'name',
      description: '',
      landLegalDescription: '',
      address: 'Test, Alert Bay',
      addressId: 1,
      administrativeArea: 'Alert Bay',
      province: 'British Columbia',
      postal: '',
      agency: 'Ministry of Advanced Education, Skills & Training',
      agencyCode: 'AEST',
      agencyId: 1,
      classification: 'Surplus Active',
      classificationId: Classifications.SurplusActive,
      constructionTypeId: 0,
      propertyTypeId: 0,
      propertyType: '',
      assessedLand: 1,
      assessedLandDate: '2020-01-01T00:00:00',
      market: 0,
      floorCount: 0,
      isSensitive: false,
      landArea: 123,
      latitude: 48.42538763146778,
      longitude: -123.39006198220181,
      netBook: 1,
      netBookFiscalYear: 2020,
      occupantTypeId: 0,
      predominateUseId: 0,
      rentableArea: 0,
      transferLeaseOnSale: false,
      zoning: '',
      zoningPotential: '',
    },
  ],
};
const mockKeycloak = (claims: string[]) => {
  (useKeycloak as jest.Mock).mockReturnValue({
    keycloak: {
      userInfo: {
        agencies: [1],
        roles: claims,
      },
      subject: 'test',
    },
  });
};

const history = createMemoryHistory();

const getGreTransferStep = (storeOverride?: any) => (
  <Provider store={storeOverride ?? getStore(mockProject)}>
    <Router history={history}>
      <GreTransferStep />
    </Router>
  </Provider>
);

describe('GRE Transfer Step', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    cleanup();
  });
  beforeAll(() => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onAny().reply(200, {});
  });
  it('renders correctly', () => {
    mockKeycloak([]);
    const tree = renderer.create(getGreTransferStep()).toJSON();
    expect(tree).toMatchSnapshot();
  });
  describe('Display when user has required claims', () => {
    beforeAll(() => {
      mockKeycloak([Claims.ADMIN_PROJECTS]);
    });

    it('update button is visible but disabled', () => {
      const { getByText } = render(getGreTransferStep());
      const updateButton = getByText(/Update Property Information Management System/);
      expect(updateButton).toBeVisible();
      expect(updateButton).toBeDisabled();
    });
    it('form fields are not disabled', () => {
      const { getByLabelText } = render(getGreTransferStep());
      const textBox = getByLabelText(/New Owning Agency/);
      expect(textBox).not.toBeDisabled();
    });
  });
  describe('Display when user missing claims', () => {
    beforeAll(() => {
      mockKeycloak([]);
    });
    it('update button is not rendered', () => {
      const component = render(getGreTransferStep());
      const updateButton = component.queryByText(/Update Property Information Management System/);
      expect(updateButton).toBeNull();
    });
    // TODO: Unable to get this to work.
    // it('form fields are disabled', () => {
    //   const component = render(getGreTransferStep());
    //   const textboxes = component.queryAllByRole('textbox');
    //   textboxes.forEach(textbox => {
    //     expect(textbox).toBeVisible();
    //     expect(textbox).toBeDisabled();
    //   });
    // });
  });
  describe('Display when project is transferred', () => {
    let project: IProject;
    beforeAll(() => {
      mockKeycloak([Claims.ADMIN_PROJECTS]);
      project = _.cloneDeep(mockProject);
      project.statusCode = ReviewWorkflowStatus.TransferredGRE;
    });

    it('update button is not rendered', () => {
      const component = render(getGreTransferStep(getStore(project)));
      const updateButton = component.queryByText(/Update Property Information Management System/);
      expect(updateButton).toBeNull();
    });
    // TODO: Unable to get this to work.
    // it('form fields are enabled/disabled', () => {
    //   const component = render(getGreTransferStep(getStore(project)));
    //   const name = component.findByTestId('project-name');
    //   const description = component.findByTestId('project-description');
    //   const agency = component.findByTestId('transfer-to-agency');
    //   expect(name).toBeEnabled();
    //   expect(description).toBeDisabled();
    //   expect(agency).toBeEnabled();
    // });
  });
  describe('GRE Transfer form actions', () => {
    beforeAll(() => {
      mockKeycloak([Claims.ADMIN_PROJECTS]);
    });
    // TODO: Stopped working after apply `useLookupCodes` hook.
    // it('enables update button when new agency is selected', async () => {
    //   const project = _.cloneDeep(mockProject);
    //   const { container } = render(getGreTransferStep(getStore(project)));
    //   const updateButton = screen.getByText(/Update Property Information Management System/);
    //   await fillInput(container, 'agencyId', 'BC Transit', 'typeahead');

    //   expect(updateButton).not.toBeDisabled();
    // });
    // TODO: Stopped working after apply `useLookupCodes` hook.
    // it('displays modal when Update PIMS button clicked', async () => {
    //   const project = _.cloneDeep(mockProject);
    //   project.properties[0].classificationId = Classifications.CoreOperational;
    //   const { container } = render(getGreTransferStep(getStore(project)));
    //   const updateButton = screen.getByText(/Update Property Information Management System/);
    //   await fillInput(container, 'agencyId', 'BC Transit', 'typeahead');
    //   await wait(() => expect(updateButton).not.toBeDisabled());
    //   updateButton.click();

    //   const errorSummary = await screen.findByText(/Really Update PIMS/);
    //   expect(errorSummary).toBeVisible();
    // });
    // TODO: Stopped working after apply `useLookupCodes` hook.
    // it('performs validation on update', async () => {
    //   const project = _.cloneDeep(mockProject);
    //   const { container } = render(getGreTransferStep(getStore(project)));
    //   const updateButton = screen.getByText(/Update Property Information Management System/);
    //   await fillInput(container, 'agencyId', 'BC Transit', 'typeahead');
    //   await act(async () => {
    //     await wait(() => expect(updateButton).not.toBeDisabled());
    //     updateButton.click();
    //   });
    //   const errorSummary = await screen.findByText(
    //     /Must select Core Operational or Core Strategic/,
    //   );
    //   expect(errorSummary).toBeVisible();
    // });
  });
});
