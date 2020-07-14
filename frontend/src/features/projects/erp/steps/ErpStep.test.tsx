import React from 'react';
import renderer from 'react-test-renderer';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { ReviewWorkflowStatus, AgencyResponses } from '../../common/interfaces';
import { render, act, screen } from '@testing-library/react';
import { useKeycloak } from '@react-keycloak/web';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import _ from 'lodash';
import { cleanup } from '@testing-library/react-hooks';
import { getStore, mockProject as defaultProject } from '../../dispose/testUtils';
import { IProject } from '../../common';
import { ErpStep } from '..';
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
mockProject.statusCode = ReviewWorkflowStatus.ERP;

const getApprovalStep = (storeOverride?: any) => (
  <Provider store={storeOverride ?? getStore(mockProject)}>
    <Router history={history}>
      <ErpStep />
    </Router>
  </Provider>
);

describe('ERP/SPL Approval Step', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    cleanup();
  });
  beforeAll(() => {
    mockAxios.onAny().reply(200, {});
  });
  it('renders correctly', () => {
    mockKeycloak([]);
    const tree = renderer.create(getApprovalStep()).toJSON();
    expect(tree).toMatchSnapshot();
  });
  describe('Display when user has required claims', () => {
    beforeAll(() => {
      mockKeycloak([Claims.ADMIN_PROJECTS]);
    });

    it('save button is visible and not disabled', () => {
      const { getByText } = render(getApprovalStep());
      const saveButton = getByText(/Save/);
      expect(saveButton).toBeVisible();
      expect(saveButton).not.toBeDisabled();
    });
    it('cancel button is visible and not disabled', () => {
      const { getByText } = render(getApprovalStep());
      const cancelButton = getByText(/Cancel Project/);
      expect(cancelButton).toBeVisible();
      expect(cancelButton).not.toBeDisabled();
    });
    it('Proceed to SPL button is visible and disabled', () => {
      const { getByText } = render(getApprovalStep());
      const proceedToSplButton = getByText(/Proceed to SPL/);
      expect(proceedToSplButton).toBeVisible();
      expect(proceedToSplButton).toBeDisabled();
    });
    it('Not in SPL button is visible and disabled', () => {
      const { getByText } = render(getApprovalStep());
      const proceedToSplButton = getByText(/Not Included in the SPL/);
      expect(proceedToSplButton).toBeVisible();
      expect(proceedToSplButton).toBeDisabled();
    });
    it('form fields are not disabled', () => {
      const { queryAllByRole } = render(getApprovalStep());
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
      const component = render(getApprovalStep());
      const saveButton = component.queryByText(/Save/);
      expect(saveButton).toBeNull();
    });
    it('cancel button is not rendered', () => {
      const component = render(getApprovalStep());
      const cancelButton = component.queryByText(/Cancel Project/);
      expect(cancelButton).toBeNull();
    });
    it('Proceed to SPL button is disabled', () => {
      const component = render(getApprovalStep());
      const proceedToSplButton = component.queryByText(/Proceed to SPL/);
      expect(proceedToSplButton).toBeDisabled();
    });
    it('Not in SPL button is disabled', () => {
      const component = render(getApprovalStep());
      const proceedToSplButton = component.queryByText(/Not Included in the SPL/);
      expect(proceedToSplButton).toBeDisabled();
    });
    it('form fields are disabled', () => {
      const component = render(getApprovalStep());
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

    it('save button is not rendered', () => {
      const component = render(getApprovalStep(getStore(project)));
      const saveButton = component.queryByText(/Save/);
      expect(saveButton).toBeNull();
    });
    it('cancel button is not rendered', () => {
      const component = render(getApprovalStep(getStore(project)));
      const cancelButton = component.queryByText(/Cancel Project/);
      expect(cancelButton).toBeNull();
    });
    it('Proceed to SPL button is disabled', () => {
      const component = render(getApprovalStep(getStore(project)));
      const proceedToSplButton = component.queryByText(/Proceed to SPL/);
      expect(proceedToSplButton).toBeDisabled();
    });
    it('Not in SPL button is disabled', () => {
      const component = render(getApprovalStep(getStore(project)));
      const proceedToSplButton = component.queryByText(/Not Included in the SPL/);
      expect(proceedToSplButton).toBeDisabled();
    });
    it('form fields are disabled', () => {
      const component = render(getApprovalStep(getStore(project)));
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
    it('enables on hold button when on hold date entered', () => {
      const project = _.cloneDeep(mockProject);
      project.onHoldNotificationSentOn = new Date();

      const { getByText } = render(getApprovalStep(getStore(project)));
      const onHoldButton = getByText(/Place Project On Hold/);
      expect(onHoldButton).not.toBeDisabled();
    });
    it('enables proceed to SPL button when clearance date entered', () => {
      const project = _.cloneDeep(mockProject);
      project.clearanceNotificationSentOn = new Date();

      const { getByText } = render(getApprovalStep(getStore(project)));
      const proceedToSplButton = getByText(/Proceed to SPL/);
      expect(proceedToSplButton).not.toBeDisabled();
    });
    it('enables not in SPL button when clearance date entered', () => {
      const project = _.cloneDeep(mockProject);
      project.clearanceNotificationSentOn = new Date();

      const { getByText } = render(getApprovalStep(getStore(project)));
      const proceedToSplButton = getByText(/Not Included in the SPL/);
      expect(proceedToSplButton).not.toBeDisabled();
    });
    it('displays modal when cancel button clicked', async (done: any) => {
      const component = render(getApprovalStep());
      const cancelButton = component.getByText(/Cancel Project/);
      act(() => {
        cancelButton.click();
      });
      const cancelModel = await screen.findByText(/Really Cancel Project/);
      expect(cancelModel).toBeVisible();
      done();
    });
    it('displays modal when proceed to SPL button clicked', async (done: any) => {
      const project = _.cloneDeep(mockProject);
      project.clearanceNotificationSentOn = new Date();

      const component = render(getApprovalStep(getStore(project)));
      const proceedToSplButton = component.getByText(/Proceed to SPL/);
      act(() => {
        proceedToSplButton.click();
      });
      const proceedModal = await screen.findByText(/Really Proceed to SPL/);
      expect(proceedModal).toBeVisible();
      done();
    });
    it('performs validation on save', async (done: any) => {
      const project = _.cloneDeep(mockProject);
      project.tasks[0].isOptional = false;

      render(getApprovalStep(getStore(project)));
      const saveButton = screen.getByText(/Save/);
      act(() => {
        saveButton.click();
      });

      const errorSummary = await screen.findByText(/The following tabs have errors/);
      expect(errorSummary).toBeVisible();
      done();
    });
    it('filters agency responses on save', async (done: any) => {
      const project = _.cloneDeep(mockProject);
      project.projectAgencyResponses = [
        {
          projectId: project.id,
          agencyId: project.agencyId,
          response: AgencyResponses.Ignore,
        },
      ];

      render(getApprovalStep(getStore(project)));
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
  });
});
