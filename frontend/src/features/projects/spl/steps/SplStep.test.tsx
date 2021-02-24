import React from 'react';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { ReviewWorkflowStatus, AgencyResponses } from '../../common/interfaces';
import { render, act, screen, cleanup } from '@testing-library/react';
import { useKeycloak } from '@react-keycloak/web';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import _ from 'lodash';
import { getStore, mockProject as defaultProject, mockFlatProject } from '../../dispose/testUtils';
import { IProject, SPPApprovalTabs } from '../../common';
import { SplStep } from '..';
import Claims from 'constants/claims';
import { PropertyTypes } from 'constants/propertyTypes';

jest.mock('@react-keycloak/web');
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
const mockAxios = new MockAdapter(axios);
const mockProject = _.cloneDeep(defaultProject);
mockProject.statusCode = ReviewWorkflowStatus.PreMarketing;
mockProject.approvedOn = '2020-07-15';
mockProject.submittedOn = '2020-07-15';

const getSplStep = (storeOverride?: any) => (
  <Provider store={storeOverride ?? getStore(mockProject)}>
    <Router history={history}>
      <SplStep />
    </Router>
  </Provider>
);

describe('SPL Approval Step', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    cleanup();
    mockAxios.reset();
  });
  beforeAll(() => {
    mockAxios.onAny().reply(200, {});
  });
  it('renders correctly', () => {
    mockKeycloak([]);
    const { container } = render(getSplStep());
    expect(container.firstChild).toMatchSnapshot();
  });
  describe('SPL tab Display', () => {
    beforeAll(() => {
      mockKeycloak([Claims.ADMIN_PROJECTS]);
    });
    it('Displays Project Information Tab', () => {
      const store = getStore(mockProject, SPPApprovalTabs.projectInformation);
      const { getByText } = render(getSplStep(store));
      expect(getByText(/Project No\./)).toBeVisible();
    });
    it('Displays Documentation Tab', () => {
      const store = getStore(mockProject, SPPApprovalTabs.documentation);
      const { getByText } = render(getSplStep(store));
      expect(getByText(/First Nations Consultation/)).toBeVisible();
    });
    it('Displays ERP Tab', () => {
      const store = getStore(mockProject, SPPApprovalTabs.erp);
      const { getByText } = render(getSplStep(store));
      expect(getByText(/Enhanced Referral Process Complete/)).toBeVisible();
    });
    it('Displays SPL Tab', () => {
      const store = getStore(mockProject, SPPApprovalTabs.spl);
      const { getByText } = render(getSplStep(store));
      expect(getByText(/Date Entered Market/)).toBeVisible();
    });
    it('Displays close out Tab', () => {
      const store = getStore(mockProject, SPPApprovalTabs.closeOutForm);
      const { getByText } = render(getSplStep(store));
      expect(getByText(/Signed by Chief Financial Officer/)).toBeVisible();
    });
  });
  describe('Display when user has required claims', () => {
    beforeAll(() => {
      mockKeycloak([Claims.ADMIN_PROJECTS]);
    });

    it('save button is visible and not disabled', () => {
      const { getByText } = render(getSplStep());
      const saveButton = getByText(/Save/);
      expect(saveButton).toBeVisible();
      expect(saveButton).not.toBeDisabled();
    });
    it('cancel button is visible and not disabled', () => {
      const { getByText } = render(getSplStep());
      const cancelButton = getByText(/Cancel Project/);
      expect(cancelButton).toBeVisible();
      expect(cancelButton).not.toBeDisabled();
    });
    it('form fields are not disabled', () => {
      const { queryAllByRole } = render(getSplStep());
      const textboxes = queryAllByRole('textbox');
      textboxes.forEach(textbox => {
        expect(textbox).toBeVisible();
        if (!textbox.className.includes('date-picker') && textbox.id !== 'input-note') {
          expect(textbox).not.toBeDisabled();
        }
      });
    });
  });
  describe('Display when user missing claims', () => {
    beforeAll(() => {
      mockKeycloak([]);
    });
    it('save button is not rendered', () => {
      const { queryByText } = render(getSplStep());
      const saveButton = queryByText(/Save/);
      expect(saveButton).toBeNull();
    });
    it('cancel button is not rendered', () => {
      const { queryByText } = render(getSplStep());
      const cancelButton = queryByText(/Cancel Project/);
      expect(cancelButton).toBeNull();
    });
    it('form fields are disabled', () => {
      const component = render(getSplStep());
      const textboxes = component.queryAllByRole('textbox');
      textboxes.forEach(textbox => {
        expect(textbox).toBeVisible();
        expect(textbox).toBeDisabled();
      });
    });
  });
  describe('Display when project is cancelled', () => {
    let project: IProject;
    beforeAll(() => {
      mockKeycloak([Claims.ADMIN_PROJECTS]);
      project = _.cloneDeep(mockProject);
      project.statusCode = ReviewWorkflowStatus.Cancelled;
    });
    it('save button is visible and disabled', () => {
      const { queryByText } = render(getSplStep(getStore(project)));
      const saveButton = queryByText(/Save/);
      expect(saveButton).toBeNull();
    });
    it('cancel button is visible and disabled', () => {
      const { queryByText } = render(getSplStep(getStore(project)));
      const cancelButton = queryByText(/Cancel Project/);
      expect(cancelButton).toBeNull();
    });
    it('form fields are disabled', () => {
      const component = render(getSplStep(getStore(project)));
      const textboxes = component.queryAllByRole('textbox');
      textboxes.forEach(textbox => {
        expect(textbox).toBeVisible();
        expect(textbox).toBeDisabled();
      });
    });
  });
  describe('form actions', () => {
    beforeAll(() => {
      mockKeycloak([Claims.ADMIN_PROJECTS]);
    });
    it('enables Change status to marketing when date entered', () => {
      const project = _.cloneDeep(mockProject);
      project.marketedOn = new Date();

      const { getByText } = render(getSplStep(getStore(project)));
      const marketingButton = getByText(/Marketing/);
      expect(marketingButton).not.toBeDisabled();
    });
    it('enables change status to contract in place - conditional button when date entered', () => {
      const project = _.cloneDeep(mockProject);
      project.statusCode = ReviewWorkflowStatus.OnMarket;
      project.offerAmount = 12345;
      project.clearanceNotificationSentOn = new Date();

      const { getByText } = render(getSplStep(getStore(project)));
      const contractInPlaceButton = getByText(/Conditional/);
      expect(contractInPlaceButton).not.toBeDisabled();
    });
    it('enables change status to contract in place - unconditional button when date entered', () => {
      const project = _.cloneDeep(mockProject);
      project.statusCode = ReviewWorkflowStatus.OnMarket;
      project.offerAmount = 12345;
      project.clearanceNotificationSentOn = new Date();

      const { getByText } = render(getSplStep(getStore(project)));
      const contractInPlaceButton = getByText(/Unconditional/);
      expect(contractInPlaceButton).not.toBeDisabled();
    });
    it('toggles change status to unconditional when status is contract in place', () => {
      const project = _.cloneDeep(mockProject);
      project.statusCode = ReviewWorkflowStatus.ContractInPlaceConditional;

      const component = render(getSplStep(getStore(project)));
      const preMarketingButton = component.getAllByText(/Unconditional/)[0];
      expect(preMarketingButton).not.toBeDisabled();
    });
    it('displays modal when cancel button clicked', async (done: any) => {
      const component = render(getSplStep());
      const cancelButton = component.getByText(/Cancel Project/);
      act(() => {
        cancelButton.click();
      });
      const cancelModel = await screen.findByText(/Really Cancel Project/);
      expect(cancelModel).toBeVisible();
      done();
    });
    it('displays modal when proceed to change status to disposed externally button clicked', async (done: any) => {
      const project = _.cloneDeep(mockProject);
      project.disposedOn = new Date();
      project.statusCode = ReviewWorkflowStatus.ContractInPlaceConditional;
      project.offerAcceptedOn = new Date();
      project.purchaser = 'purchaser';
      project.offerAmount = 12345;
      project.marketedOn = new Date();
      project.assessed = 123;
      project.market = 123;
      project.netBook = 123;

      const component = render(getSplStep(getStore(project)));
      const disposedButton = component.getAllByText(/Dispose/)[0];
      act(() => {
        disposedButton.click();
      });
      const proceedModal = await screen.findByText(/Really Dispose Project/);
      expect(proceedModal).toBeVisible();
      done();
    });
    it('spl performs no validation on save', async (done: any) => {
      const project = _.cloneDeep(mockProject);
      project.tasks[0].isOptional = false;

      render(getSplStep(getStore(project)));
      const saveButton = screen.getByText(/Save/);
      act(() => {
        saveButton.click();
      });

      const errorSummary = await screen.queryByText(/The following tabs have errors/);
      expect(errorSummary).toBeNull();
      done();
    });
    it('performs validation on dispose', async (done: any) => {
      const project = _.cloneDeep(mockProject);
      project.disposedOn = undefined;
      project.marketedOn = undefined;
      project.statusCode = ReviewWorkflowStatus.ContractInPlaceConditional;

      const component = render(getSplStep(getStore(project)));

      const disposeButton = component.getAllByText(/^Dispose$/)[0];
      act(() => {
        disposeButton.click();
      });

      await screen.findByText('Really Dispose Project?');
      const disposeProjectButton = component.getAllByText(/^Dispose Project$/)[0];
      act(() => {
        disposeProjectButton.click();
      });

      const errorSummary = await screen.findByText(/The form has errors/);
      expect(errorSummary).toBeVisible();
      done();
    });
    it('spl filters agency responses on save', async (done: any) => {
      const project = _.cloneDeep(mockProject);
      project.projectAgencyResponses = [
        {
          projectId: project.id ?? 1,
          agencyId: project.agencyId,
          response: AgencyResponses.Ignore,
        },
      ];

      render(getSplStep(getStore(project)));
      const saveButton = screen.getByText(/Save/);
      mockAxios
        .onPut()
        .reply((config: any) => {
          if (JSON.parse(config.data).projectAgencyResponses?.length === 0) {
            done();
          } else {
            done.fail('projectAgencyResponses was not equal to []');
          }
          return [200, Promise.resolve({ properties: [] })];
        })
        .onAny()
        .reply((config: any) => {
          return [200, Promise.resolve({})];
        });

      await act(async () => {
        saveButton.click();
      });
    });

    it('spl disposes project', async (done: any) => {
      const project = _.cloneDeep(mockProject);
      project.disposedOn = new Date();
      project.statusCode = ReviewWorkflowStatus.ContractInPlaceConditional;
      project.assessed = 123;
      project.market = 123;
      project.netBook = 123;

      const component = render(getSplStep(getStore(project)));
      const disposeButton = component.getAllByText('Dispose')[0];
      mockAxios
        .onPut()
        .reply((config: any) => {
          if (config.url.includes(ReviewWorkflowStatus.Disposed)) {
            done();
          } else {
            done.fail('status code was not disposed');
          }
          return [200, Promise.resolve({})];
        })
        .onAny()
        .reply((config: any) => {
          return [200, Promise.resolve({})];
        });

      await act(async () => {
        disposeButton.click();
        const disposePopupButton = await component.findAllByText(/Dispose Project/);
        disposePopupButton[1].click();
      });
    });

    it('spl disposes project with subdivisions', async (done: any) => {
      const project = _.cloneDeep(mockFlatProject as any);
      project.disposedOn = new Date();
      project.statusCode = ReviewWorkflowStatus.ContractInPlaceConditional;
      project.assessed = 123;
      project.market = 123;
      project.netBook = 123;
      project.properties[0].propertyTypeId = PropertyTypes.SUBDIVISION;
      project.properties[0].parcels = [{ id: 1, pid: '123456789', pin: 1 }];

      const component = render(getSplStep(getStore(project)));
      const disposeButton = component.getAllByText('Dispose')[0];

      await act(async () => {
        disposeButton.click();
        await component.findAllByText(/There are one or more subdivisions/);
        expect(await screen.findByText('PID 123-456-789')).toBeVisible();
        done();
      });
    });
  });

  describe('close out form tab', () => {
    beforeAll(() => {
      jest.clearAllMocks();
      cleanup();
      mockKeycloak([Claims.ADMIN_PROJECTS]);
    });
    afterEach(() => {
      mockAxios.reset();
    });
    const store = getStore(mockProject, SPPApprovalTabs.closeOutForm);
    it('renders correctly', () => {
      const { container } = render(getSplStep(store));
      expect(container.firstChild).toMatchSnapshot();
    });

    it('displays close out form tab by default if project disposed', () => {
      const project = _.cloneDeep(mockProject);
      project.statusCode = ReviewWorkflowStatus.Disposed;
      const { getByText } = render(getSplStep(getStore(project)));
      expect(getByText('Financial Summary')).toBeVisible();
    });

    it('displays close out notes', () => {
      const { getByText } = render(getSplStep(store));
      expect(getByText('Adjustment to Prior Year Sale Notes')).toBeVisible();
      expect(getByText('Project Comments')).toBeVisible();
      expect(getByText('OCG Variance Notes')).toBeVisible();
    });
  });
});
