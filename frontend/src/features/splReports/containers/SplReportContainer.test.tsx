import { useKeycloak } from '@react-keycloak/web';
import { queryByText, screen } from '@testing-library/dom';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import Claims from 'constants/claims';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createMemoryHistory } from 'history';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { formatApiDateTime } from 'utils';
import { fillInput } from 'utils/testUtils';

import { useProjectSnapshotApi } from '../hooks/useProjectSnapshotApi';
import { IReport, ISnapshot } from '../interfaces';
import SplReportContainer from './SplReportContainer';

// Set all module functions to jest.fn
jest.mock('../hooks/useProjectSnapshotApi');
jest.mock('@react-keycloak/web');
Enzyme.configure({ adapter: new Adapter() });
(useKeycloak as jest.Mock).mockReturnValue({
  keycloak: {
    userInfo: {
      agencies: ['1'],
    },
    subject: 'test',
  },
});
const mockApiResponse = {
  getProjectReports: jest.fn<Promise<IReport[]>, []>(),
  getProjectReportSnapshotsById: jest.fn<Promise<ISnapshot[]>, [number]>(),
  getProjectReportSnapshots: jest.fn<Promise<ISnapshot[]>, [IReport]>(),
  refreshProjectReportSnapshots: jest.fn<Promise<ISnapshot[]>, [IReport]>(),
  deleteProjectReport: jest.fn<Promise<any>, [IReport]>(),
  addProjectReport: jest.fn<Promise<any>, [IReport]>(),
  updateProjectReport: jest.fn<Promise<any>, [IReport]>(),
};

const mockApi = ((useProjectSnapshotApi as unknown) as jest.Mock<
  typeof mockApiResponse
>).mockReturnValue(mockApiResponse);

const mockStore = configureMockStore([thunk]);

const history = () =>
  createMemoryHistory({
    getUserConfirmation: (message, callback) => {
      callback(true);
    },
  });
const defaultReport: IReport = {
  id: 1,
  name: 'report 1',
  to: '2020-10-14T17:45:39.7381599',
  from: undefined,
  reportTypeId: 0,
  isFinal: false,
  rowVersion: '',
};

const defaultSnapshot: ISnapshot = {
  assessed: 1,
  baselineIntegrity: 2,
  market: 3,
  gainLoss: 4,
  interestComponent: 5,
  netBook: 6,
  netProceeds: 7,
  ocgFinancialStatement: 8,
  programCost: 9,
  projectId: 10,
  salesCost: 11,
  salesWithLeaseInPlace: false,
  snapshotOn: '2020-10-14T17:45:39.7381599',
  project: {
    actualFiscalYear: '2021',
    risk: 'Green',
  } as any,
};

const renderContainer = () =>
  render(
    <Provider
      store={mockStore({
        lookupCode: { lookupCodes: [] },
      })}
    >
      <Router history={history()}>
        <ToastContainer
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss={false}
        />
        <SplReportContainer />,
      </Router>
    </Provider>,
  );

describe('Spl Report Container', () => {
  // clear mocks before each test
  beforeEach(() => {
    mockApi().getProjectReports.mockClear();
    mockApi().getProjectReportSnapshotsById.mockClear();
    mockApi().deleteProjectReport.mockClear();
    mockApi().updateProjectReport.mockClear();
    jest.clearAllMocks();
  });
  afterEach(() => {
    cleanup();
  });

  describe('basic data loading and display', () => {
    xit('Displays project snapshot data', async () => {
      await act(async () => {
        mockApi().getProjectReports.mockResolvedValue([
          { ...defaultReport, to: '' },
          { ...defaultReport, to: '', name: 'report 2' },
        ]);
        mockApi().getProjectReportSnapshotsById.mockResolvedValue([defaultSnapshot]);
        const { findByText, container } = renderContainer();
        const fiscalYear = await findByText('20/21');
        const market = await findByText('$3');
        const risk = await findByText('Green');
        expect(fiscalYear).toBeVisible();
        expect(market).toBeVisible();
        expect(risk).toBeVisible();
        expect(container.firstChild).toMatchSnapshot();
      });
    });

    xit('Matches snapshot', async () => {
      await act(async () => {
        // API "returns" no results
        mockApi().getProjectReports.mockResolvedValueOnce([]);
        mockApi().getProjectReportSnapshotsById.mockResolvedValueOnce([]);
        const { container, findByText } = renderContainer();
        await findByText('No Reports Available');
        expect(container.firstChild).toMatchSnapshot();
      });
    });

    xit('Displays correct message when there are no snapshots', async () => {
      await act(async () => {
        // API "returns" no results
        mockApi().getProjectReports.mockResolvedValueOnce([]);
        mockApi().getProjectReportSnapshotsById.mockResolvedValueOnce([]);
        const { findByText } = renderContainer();
        const text = await findByText('No Reports Available');
        expect(text).toBeVisible();
      });
    });

    xit('Loads the most recent report by default', async () => {
      await act(async () => {
        // API "returns" no results
        mockApi().getProjectReports.mockResolvedValue([
          defaultReport,
          { ...defaultReport, name: 'report 2' },
        ]);
        mockApi().getProjectReportSnapshotsById.mockResolvedValue([]);
        const { findByText, getByText, getByLabelText } = renderContainer();
        await findByText('No Reports Available');

        expect(getByLabelText('Name:')).toHaveValue(defaultReport.name);
        expect(getByText('From: N/A')).toBeVisible();
        expect(getByLabelText('To:')).toHaveValue(formatApiDateTime(defaultReport.to));
      });
    });

    xit('Loads snapshot data from the active report', async () => {
      await act(async () => {
        // API "returns" no results
        mockApi().getProjectReports.mockResolvedValue([
          defaultReport,
          { ...defaultReport, name: 'report 2' },
        ]);
        mockApi().getProjectReportSnapshotsById.mockResolvedValue([]);
        const { findByText } = renderContainer();
        await findByText('No Reports Available');

        expect(mockApi().getProjectReportSnapshotsById).toHaveBeenCalledWith<[number | undefined]>(
          defaultReport.id,
        );
      });
    });
  });
  describe('spl report sidebar functionality', () => {
    xit('Displays a warning when a user deletes a report.', async () => {
      await act(async () => {
        // API "returns" no results
        mockApi().getProjectReports.mockResolvedValue([defaultReport]);
        mockApi().getProjectReportSnapshotsById.mockResolvedValue([defaultSnapshot]);
        const { findByTitle, findByText } = renderContainer();
        const elipsis = await findByTitle('Report 1 actions');
        fireEvent.click(elipsis);
        const deleteButton = await findByText('Delete');
        fireEvent.click(deleteButton);

        const modal = await screen.findByText('Confirm Delete');
        expect(modal).toBeVisible();
      });
    });

    xit('Deletes the report when the delete is confirmed', async () => {
      await act(async () => {
        // API "returns" no results
        mockApi().getProjectReports.mockResolvedValue([defaultReport]);
        mockApi().getProjectReportSnapshotsById.mockResolvedValue([defaultSnapshot]);
        const { findByTitle, findByText } = renderContainer();

        const elipsis = await findByTitle('Report 1 actions');
        fireEvent.click(elipsis);
        const deleteButton = await findByText('Delete');
        fireEvent.click(deleteButton);
        //now confirm the deletion.
        const modal = await screen.findByText('Confirm Delete');
        expect(modal).toBeVisible();
        const modalDelete = screen.getAllByText('Delete')[1];
        fireEvent.click(modalDelete);

        expect(mockApi().deleteProjectReport).toHaveBeenCalled();
      });
    });

    xit('An SPL Reporter should not be able to delete a final report', async () => {
      await act(async () => {
        (useKeycloak as jest.Mock).mockReturnValue({
          keycloak: {
            subject: 'test',
            userInfo: {
              roles: [Claims.REPORTS_SPL],
            },
          },
        });
        // API "returns" no results
        mockApi().getProjectReports.mockResolvedValue([{ ...defaultReport, isFinal: true }]);
        mockApi().getProjectReportSnapshotsById.mockResolvedValue([defaultSnapshot]);
        const { findByTitle, container } = renderContainer();

        const elipsis = await findByTitle('Report 1 actions');
        fireEvent.click(elipsis);
        const textBox = queryByText(container, 'Delete');
        expect(textBox).not.toBeInTheDocument();
      });
    });

    xit('Displays a toast warning when trying to delete a final report', async () => {
      await act(async () => {
        (useKeycloak as jest.Mock).mockReturnValue({
          keycloak: {
            subject: 'test',
            userInfo: {
              roles: [Claims.REPORTS_SPL_ADMIN],
            },
          },
        });
        // API "returns" no results
        mockApi().getProjectReports.mockResolvedValue([{ ...defaultReport, isFinal: true }]);
        mockApi().getProjectReportSnapshotsById.mockResolvedValue([defaultSnapshot]);
        const { findByTitle, findByText } = renderContainer();

        const elipsis = await findByTitle('Report 1 actions');
        fireEvent.click(elipsis);
        const deleteButton = await findByText('Delete');
        fireEvent.click(deleteButton);
        //now confirm the deletion.

        const warning = await screen.findByText(
          "Deleting 'Final' reports is not allowed. You must remove the 'Final' flag on this report to delete it",
        );
        expect(warning).toBeVisible();
      });
    });

    xit('A Financial Reporter should not see the "Mark as Final" option on a non-final report', async () => {
      await act(async () => {
        (useKeycloak as jest.Mock).mockReturnValue({
          keycloak: {
            subject: 'test',
            userInfo: {
              roles: [Claims.REPORTS_SPL],
            },
          },
        });
        // API "returns" no results
        mockApi().getProjectReports.mockResolvedValue([{ ...defaultReport }]);
        mockApi().getProjectReportSnapshotsById.mockResolvedValue([defaultSnapshot]);
        const { findByTitle, container } = renderContainer();
        const elipsis = await findByTitle('Report 1 actions');
        fireEvent.click(elipsis);
        const finalButton = queryByText(container, 'Mark as Final');
        expect(finalButton).not.toBeInTheDocument();
      });
    });

    xit('Calls the update api when the Mark as Final button is clicked on a non-final report', async () => {
      await act(async () => {
        (useKeycloak as jest.Mock).mockReturnValue({
          keycloak: {
            subject: 'test',
            userInfo: {
              roles: [Claims.REPORTS_SPL_ADMIN],
            },
          },
        });
        // API "returns" no results
        mockApi().getProjectReports.mockResolvedValue([{ ...defaultReport }]);
        mockApi().getProjectReportSnapshotsById.mockResolvedValue([defaultSnapshot]);
        const { findByTitle, findByText } = renderContainer();
        const elipsis = await findByTitle('Report 1 actions');
        fireEvent.click(elipsis);
        const finalButton = await findByText('Mark as Final');
        fireEvent.click(finalButton);

        expect(mockApi().updateProjectReport).toHaveBeenCalled();
      });
    });

    xit('Displays a warning when a user tries to remove the final flag', async () => {
      await act(async () => {
        (useKeycloak as jest.Mock).mockReturnValue({
          keycloak: {
            subject: 'test',
            userInfo: {
              roles: [Claims.REPORTS_SPL_ADMIN],
            },
          },
        });
        // API "returns" no results
        mockApi().getProjectReports.mockResolvedValue([{ ...defaultReport, isFinal: true }]);
        mockApi().getProjectReportSnapshotsById.mockResolvedValue([defaultSnapshot]);
        const { findByTitle, findByText } = renderContainer();
        const elipsis = await findByTitle('Report 1 actions');
        fireEvent.click(elipsis);
        const finalButton = await findByText('Remove Final');
        fireEvent.click(finalButton);

        const modal = await screen.findByText('Confirm Delete');
        expect(modal).toBeVisible();
      });
    });

    xit('Updates the report when a user confirms the final flag removal', async () => {
      await act(async () => {
        (useKeycloak as jest.Mock).mockReturnValue({
          keycloak: {
            subject: 'test',
            userInfo: {
              roles: [Claims.REPORTS_SPL_ADMIN],
            },
          },
        });
        // API "returns" no results
        mockApi().getProjectReports.mockResolvedValue([{ ...defaultReport, isFinal: true }]);
        mockApi().getProjectReportSnapshotsById.mockResolvedValue([defaultSnapshot]);
        const { findByTitle, findByText } = renderContainer();

        const elipsis = await findByTitle('Report 1 actions');
        fireEvent.click(elipsis);
        const finalButton = await findByText('Remove Final');
        fireEvent.click(finalButton);
        //now confirm the deletion.
        const modal = await screen.findByText("Really Remove 'Final' Flag?");
        expect(modal).toBeVisible();
        const modalDelete = screen.getByText("Remove 'Final'");
        fireEvent.click(modalDelete);

        expect(mockApi().updateProjectReport).toHaveBeenCalled();
      });
    });

    xit('Changes the active report when the report name is clicked', async () => {
      await act(async () => {
        // API "returns" no results
        mockApi().getProjectReports.mockResolvedValue([
          defaultReport,
          { ...defaultReport, name: 'report 2', id: 2 },
        ]);
        const { findByText } = renderContainer();
        const report = await findByText('report 2');
        mockApi().getProjectReportSnapshotsById.mockClear();
        fireEvent.click(report);
        await waitFor(() => {
          expect(mockApi().getProjectReportSnapshotsById).toHaveBeenCalledWith<[number]>(2);
        });
      });
    });
  });
  describe('Main report page control functionality', () => {
    xit('allows any older report to be selected in the From: field', async () => {
      await act(async () => {
        // API "returns" no results
        mockApi().getProjectReports.mockResolvedValue([
          defaultReport,
          { ...defaultReport, name: 'report 2', id: 2, to: '2020-09-15T17:45:39.7381599' },
          { ...defaultReport, name: 'report 3', id: 3, to: '2020-08-15T17:45:39.7381599' },
        ]);
        const { findAllByText } = renderContainer();

        const optionOne = await findAllByText('report 2');
        const optionTwo = await findAllByText('report 3');
        expect(optionOne).toHaveLength(1);
        expect(optionTwo).toHaveLength(2);
      });
    });
    xit('refreshes the snapshots when the refresh button is clicked', async () => {
      await act(async () => {
        // API "returns" no results
        mockApi().getProjectReports.mockResolvedValue([defaultReport]);
        const { findByTitle, findByText } = renderContainer();
        await findByText('report 1');
        const refresh = await findByTitle('refresh-button');
        mockApi().getProjectReportSnapshotsById.mockClear();
        fireEvent.click(refresh);

        expect(mockApi().refreshProjectReportSnapshots).toHaveBeenCalled();
      });
    });
    xit('the save button is disabled by default', async () => {
      await act(async () => {
        // API "returns" no results
        mockApi().getProjectReports.mockResolvedValue([defaultReport]);
        mockApi().getProjectReportSnapshotsById.mockResolvedValue([defaultSnapshot]);
        const { findByText } = renderContainer();
        await findByText('report 1');
        const save = await findByText('Save');
        expect(save.parentElement).toBeDisabled();
      });
    });
    xit('the save button can be clicked after updating a field', async () => {
      let result: any;
      await act(async () => {
        // API "returns" no results
        mockApi().getProjectReports.mockResolvedValue([defaultReport]);
        result = renderContainer();
        await result.findByText('report 1');
      });
      fillInput(result.container, 'name', 'a new name');
      await waitFor(async () => {
        const save = await result.findByText('Save');
        expect(save).not.toBeDisabled();
      });
    });
  });
});
