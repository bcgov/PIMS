import { useKeycloak } from '@react-keycloak/web';
import { fireEvent, screen } from '@testing-library/dom';
import { render, waitFor } from '@testing-library/react';
import { cleanup } from '@testing-library/react-hooks';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Claims } from 'constants/claims';
import { Classifications } from 'constants/classifications';
import { ReviewWorkflowStatus } from 'features/projects/constants';
import { IProject } from 'features/projects/interfaces';
import { createMemoryHistory } from 'history';
import _ from 'lodash';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { fillInput } from 'utils/testUtils';

import { getStore, mockProject as project } from '../../dispose/testUtils';
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
    <MemoryRouter initialEntries={[history.location]}>
      <GreTransferStep />
    </MemoryRouter>
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
    const { container } = render(getGreTransferStep());
    expect(container.firstChild).toMatchSnapshot();
  });
  describe('Display when user has required claims', () => {
    beforeAll(() => {
      mockKeycloak([Claims.ADMIN_PROJECTS]);
    });

    it('update button is visible but disabled', async () => {
      const { findByText } = render(getGreTransferStep());
      const updateButton = await findByText(/Update Property Information Management System/);
      expect(updateButton).toBeVisible();
      expect(updateButton.parentElement).toBeDisabled();
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
    it('form fields are enabled/disabled', async () => {
      const component = render(getGreTransferStep(getStore(project)));
      const name = await component.findByTestId('project-name');
      const description = await component.findByTestId('project-description');
      const agency = component.container.querySelector(`input[name="agencyId"]`);
      expect(name).toBeEnabled();
      expect(description).toBeEnabled();
      expect(agency).toBeEnabled();
    });
  });
  describe('GRE Transfer form actions', () => {
    beforeAll(() => {
      mockKeycloak([Claims.ADMIN_PROJECTS]);
    });

    it('enables update button when new agency is selected', async () => {
      const project = _.cloneDeep(mockProject);
      const { container } = render(getGreTransferStep(getStore(project)));
      const updateButton = screen.getByText(/Update Property Information Management System/);
      fillInput(container, 'agencyId', 'BC Transit', 'typeahead');
      await waitFor(() => expect(updateButton).not.toBeDisabled());
    });

    it('displays modal when Update PIMS button clicked', async () => {
      const project = _.cloneDeep(mockProject);
      project.properties[0].classificationId = Classifications.CoreOperational;
      const { container } = render(getGreTransferStep(getStore(project)));
      const updateButton = screen.getByText(/Update Property Information Management System/);

      fillInput(container, 'agencyId', 'BC Transit', 'typeahead');
      await waitFor(() => expect(updateButton).not.toBeDisabled());
      fireEvent.click(updateButton);

      await waitFor(async () => {
        const errorSummary = await screen.findByText(/Really Update PIMS/);
        expect(errorSummary).toBeVisible();
      });
    });

    it('gre performs validation on update', async () => {
      const project = _.cloneDeep(mockProject);
      const { container, findByText } = render(getGreTransferStep(getStore(project)));
      const updateButton = await findByText(/Update Property Information Management System/);

      fillInput(container, 'agencyId', 'BC Transit', 'typeahead');
      await waitFor(() => expect(updateButton).not.toBeDisabled());

      fireEvent.click(updateButton);
      await waitFor(async () => {
        const errorSummary = await findByText(/Must select Core Operational or Core Strategic/);
        expect(errorSummary).toBeVisible();
      });
    });
  });
});
