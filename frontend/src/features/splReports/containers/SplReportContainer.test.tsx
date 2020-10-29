import SplReportContainer from './SplReportContainer';
import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render, cleanup, fireEvent } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { useProjectSnapshotApi } from '../hooks/useProjectSnapshotApi';
import { IReport, ISnapshot } from '../interfaces';
import { formatApiDateTime } from 'utils';
import pretty from 'pretty';
import { act } from 'react-dom/test-utils';
import { screen, waitFor } from '@testing-library/dom';
import { ToastContainer } from 'react-toastify';
import { fillInput } from 'utils/testUtils';

// Set all module functions to jest.fn
jest.mock('../hooks/useProjectSnapshotApi');
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

const history = createMemoryHistory();
const defaultReport: IReport = {
  id: 1,
  name: 'report 1',
  to: '2020-10-14T17:45:39.7381599',
  from: undefined,
  reportTypeId: 0,
  isFinal: false,
};

const defaultSnapshot: ISnapshot = {
  assessed: 1,
  baselineIntegrity: 2,
  estimated: 3,
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
  } as any,
};

const renderContainer = () =>
  render(
    <Provider store={mockStore({})}>
      <Router history={history}>
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
  });
  afterEach(() => {
    history.push({ search: '' });
    cleanup();
  });

  describe('basic data loading and display', () => {
    it('Displays project snapshot data', async () => {
      await act(async () => {
        // API "returns" no results
        mockApi().getProjectReports.mockResolvedValue([
          { ...defaultReport, to: undefined },
          { ...defaultReport, to: undefined, name: 'report 2' },
        ]);
        mockApi().getProjectReportSnapshotsById.mockResolvedValue([defaultSnapshot]);
        const { findByText, container } = renderContainer();
        await findByText('20/21');
        expect(pretty(container.innerHTML)).toMatchSnapshot();
      });
    });

    it('Matches snapshot', async () => {
      await act(async () => {
        // API "returns" no results
        mockApi().getProjectReports.mockResolvedValueOnce([]);
        mockApi().getProjectReportSnapshotsById.mockResolvedValueOnce([]);
        const { container, findByText } = renderContainer();
        await findByText('No Reports Available');
        expect(pretty(container.innerHTML)).toMatchSnapshot();
      });
    });

    it('Displays correct message when there are no snapshots', async () => {
      await act(async () => {
        // API "returns" no results
        mockApi().getProjectReports.mockResolvedValueOnce([]);
        mockApi().getProjectReportSnapshotsById.mockResolvedValueOnce([]);
        const { findByText } = renderContainer();
        const text = await findByText('No Reports Available');
        expect(text).toBeVisible();
      });
    });

    it('Displays correct message when there are no snapshots', async () => {
      await act(async () => {
        // API "returns" no results
        mockApi().getProjectReports.mockResolvedValueOnce([]);
        mockApi().getProjectReportSnapshotsById.mockResolvedValueOnce([]);
        const { findByText } = renderContainer();
        const text = await findByText('No Reports Available');
        expect(text).toBeVisible();
      });
    });

    it('Loads the most recent report by default', async () => {
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

    it('Loads snapshot data from the active report', async () => {
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
    it('Displays a warning when a user deletes a report.', async () => {
      await act(async () => {
        // API "returns" no results
        mockApi().getProjectReports.mockResolvedValue([defaultReport]);
        mockApi().getProjectReportSnapshotsById.mockResolvedValue([defaultSnapshot]);
        const { findByTitle, findByText } = renderContainer();
        const elipsis = await findByTitle('1-elipsis');
        fireEvent.click(elipsis);
        const deleteButton = await findByText('Delete');
        fireEvent.click(deleteButton);

        const modal = await screen.findByText('Confirm Delete');
        expect(modal).toBeVisible();
      });
    });

    it('Deletes the report when the delete is confirmed', async () => {
      await act(async () => {
        // API "returns" no results
        mockApi().getProjectReports.mockResolvedValue([defaultReport]);
        mockApi().getProjectReportSnapshotsById.mockResolvedValue([defaultSnapshot]);
        const { findByTitle, findByText } = renderContainer();

        const elipsis = await findByTitle('1-elipsis');
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

    it('Displays a toast warning when trying to delete a final report', async () => {
      await act(async () => {
        // API "returns" no results
        mockApi().getProjectReports.mockResolvedValue([{ ...defaultReport, isFinal: true }]);
        mockApi().getProjectReportSnapshotsById.mockResolvedValue([defaultSnapshot]);
        const { findByTitle, findByText } = renderContainer();

        const elipsis = await findByTitle('1-elipsis');
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

    it('Calls the update api when the Mark as Final button is clicked on a non-final report', async () => {
      await act(async () => {
        // API "returns" no results
        mockApi().getProjectReports.mockResolvedValue([{ ...defaultReport }]);
        mockApi().getProjectReportSnapshotsById.mockResolvedValue([defaultSnapshot]);
        const { findByTitle, findByText } = renderContainer();
        const elipsis = await findByTitle('1-elipsis');
        fireEvent.click(elipsis);
        const finalButton = await findByText('Mark as Final');
        fireEvent.click(finalButton);

        expect(mockApi().updateProjectReport).toHaveBeenCalled();
      });
    });

    it('Displays a warning when a user tries to remove the final flag', async () => {
      await act(async () => {
        // API "returns" no results
        mockApi().getProjectReports.mockResolvedValue([{ ...defaultReport, isFinal: true }]);
        mockApi().getProjectReportSnapshotsById.mockResolvedValue([defaultSnapshot]);
        const { findByTitle, findByText } = renderContainer();
        const elipsis = await findByTitle('1-elipsis');
        fireEvent.click(elipsis);
        const finalButton = await findByText('Remove Final');
        fireEvent.click(finalButton);

        const modal = await screen.findByText('Confirm Delete');
        expect(modal).toBeVisible();
      });
    });

    it('Updates the report when a user confirms the final flag removal', async () => {
      await act(async () => {
        // API "returns" no results
        mockApi().getProjectReports.mockResolvedValue([{ ...defaultReport, isFinal: true }]);
        mockApi().getProjectReportSnapshotsById.mockResolvedValue([defaultSnapshot]);
        const { findByTitle, findByText } = renderContainer();

        const elipsis = await findByTitle('1-elipsis');
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

    it('Changes the active report when the report name is clicked', async () => {
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
    it('allows any older report to be selected in the From: field', async () => {
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
        expect(optionOne).toHaveLength(2);
        expect(optionTwo).toHaveLength(2);
      });
    });
    it('refreshes the snapshots when the refresh button is clicked', async () => {
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
    it('the save button is disabled by default', async () => {
      await act(async () => {
        // API "returns" no results
        mockApi().getProjectReports.mockResolvedValue([defaultReport]);
        const { findByText } = renderContainer();
        await findByText('report 1');
        const save = await findByText('Save');
        expect(save).toBeDisabled();
      });
    });
    it('the save button can be clicked after updating a field', async () => {
      let result: any;
      await act(async () => {
        // API "returns" no results
        mockApi().getProjectReports.mockResolvedValue([defaultReport]);
        result = renderContainer();
        await result.findByText('report 1');
      });
      await fillInput(result.container, 'name', 'a new name');
      await waitFor(async () => {
        const save = await result.findByText('Save');
        expect(save).not.toBeDisabled();
      });
    });
  });
});
