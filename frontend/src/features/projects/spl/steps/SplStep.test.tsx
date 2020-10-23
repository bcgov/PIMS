import React from 'react';
import renderer from 'react-test-renderer';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { ReviewWorkflowStatus, AgencyResponses } from '../../common/interfaces';
import { render, act, screen, cleanup } from '@testing-library/react';
import { useKeycloak } from '@react-keycloak/web';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import _ from 'lodash';
import { getStore, mockProject as defaultProject } from '../../dispose/testUtils';
import { IProject, SPPApprovalTabs } from '../../common';
import { SplStep } from '..';
import Claims from 'constants/claims';

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
    const tree = renderer.create(getSplStep()).toJSON();
    expect(tree).toMatchSnapshot();
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
      const marketingButton = getByText(/Change Status to Marketing/);
      expect(marketingButton).not.toBeDisabled();
    });
    it('enables change status to contract in place button when date entered', () => {
      const project = _.cloneDeep(mockProject);
      project.statusCode = ReviewWorkflowStatus.OnMarket;
      project.offerAmount = 12345;
      project.clearanceNotificationSentOn = new Date();

      const { getByText } = render(getSplStep(getStore(project)));
      const contractInPlaceButton = getByText(/Change Status to Contract in Place/);
      expect(contractInPlaceButton).not.toBeDisabled();
    });
    it('toggles change status to pre-marketing when status is contract in place', () => {
      const project = _.cloneDeep(mockProject);
      project.statusCode = ReviewWorkflowStatus.ContractInPlace;

      const { getByText } = render(getSplStep(getStore(project)));
      const preMarketingButton = getByText(/Change Status to Pre-Marketing/);
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
      project.statusCode = ReviewWorkflowStatus.ContractInPlace;
      project.offerAcceptedOn = new Date();
      project.purchaser = 'purchaser';
      project.offerAmount = 12345;
      project.isContractConditional = true;
      project.marketedOn = new Date();
      project.assessed = 123;
      project.estimated = 123;
      project.netBook = 123;

      const component = render(getSplStep(getStore(project)));
      const disposedButton = component.getByText(/Change Status to Disposed Externally/);
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
      project.disposedOn = new Date();
      project.marketedOn = undefined;
      project.statusCode = ReviewWorkflowStatus.ContractInPlace;

      const component = render(getSplStep(getStore(project)));
      const disposeButton = component.getByText(/Change Status to Disposed Externally/);
      act(() => {
        disposeButton.click();
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
          return [200, Promise.resolve({})];
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
      project.statusCode = ReviewWorkflowStatus.ContractInPlace;
      project.assessed = 123;
      project.estimated = 123;
      project.netBook = 123;

      const component = render(getSplStep(getStore(project)));
      const disposeButton = component.getByText(/Change Status to Disposed Externally/);
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
      const tree = renderer.create(getSplStep(store)).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('displays close out form tab by default if project disposed', () => {
      const project = _.cloneDeep(mockProject);
      project.statusCode = ReviewWorkflowStatus.Disposed;
      const { getByText } = render(getSplStep(getStore(project)));
      expect(getByText('Financing Information')).toBeVisible();
    });

    it('displays close out notes', () => {
      const { getByText } = render(getSplStep(store));
      expect(getByText('loanterms')).toBeVisible();
      expect(getByText('adjustment')).toBeVisible();
      expect(getByText('comments')).toBeVisible();
      expect(getByText('saleshistory')).toBeVisible();
    });
  });
});
