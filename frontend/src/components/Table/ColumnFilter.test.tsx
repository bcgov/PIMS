import { fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ColumnFilter from 'components/Table/ColumnFilter';
import { ColumnInstanceWithProps } from 'components/Table/types';
import * as Formik from 'formik';
import React from 'react';

describe('Testing ColumnFilter.tsx', () => {
  const useFormikContextMock = jest.spyOn(Formik, 'useFormikContext');
  const reactMock = jest.spyOn(React, 'useState');
  const setState = jest.fn();
  jest.spyOn(console, 'error').mockImplementation(() => {});
  beforeEach(() => {
    useFormikContextMock.mockReturnValue({
      values: {
        searchBy: 'address',
        pid: '',
        address: '',
        administrativeArea: '',
        name: '',
        projectNumber: '',
        agencies: '',
        classificationId: '',
        minLotSize: '',
        maxLotSize: '',
        rentableArea: '',
        propertyType: 'Land',
        maxAssessedValue: '',
        maxNetBookValue: '',
        inSurplusPropertyProgram: false,
        inEnhancedReferralProcess: false,
        surplusFilter: false,
      },
    } as unknown as any);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const column: ColumnInstanceWithProps<any> = {
    Header: 'Agency',
    align: 'left',
    responsive: true,
    width: 1.75,
    minWidth: 80,
    clickable: true,
    sortable: true,
    filterable: true,
    filter: {
      props: {
        className: 'agency-search',
        name: 'agencies',
        options: [
          {
            label: 'Advanced Education & Skills Training',
            value: '1',
            selected: false,
            code: 'AEST',
            parentId: '1',
            parent: '',
          },
        ],
        inputSize: 'large',
        placeholder: 'Filter by agency',
        filterBy: ['code'],
        hideParent: true,
        clearButton: true,
      },
    },
    depth: 0,
    id: 'agencyCode',
    maxWidth: 9007199254740991,
    canResize: true,
    isVisible: true,
    totalLeft: 0,
    totalWidth: 80,
    canSort: true,
    isSorted: false,
    sortedIndex: -1,
    toggleHidden: jest.fn(),
    toggleSortBy: jest.fn(),
    render: jest.fn(),
    getHeaderProps: jest.fn(),
    getFooterProps: jest.fn(),
    getToggleHiddenProps: jest.fn(),
    canFilter: true,
    setFilter: jest.fn(),
    filterValue: '',
    preFilteredRows: [],
    filteredRows: [],
    canGroupBy: true,
    isGrouped: true,
    groupedIndex: 0,
    toggleGroupBy: jest.fn(),
    getGroupByToggleProps: jest.fn(),
    getResizerProps: jest.fn(),
    isResizing: false,
    getSortByToggleProps: jest.fn(),
    clearSortBy: jest.fn(),
    isSortedDesc: true,
  };

  const mockFilter = jest.fn();

  it('Open inactive filter', async () => {
    reactMock.mockReturnValue([false, setState]);
    const { getByText } = render(
      <ColumnFilter
        onFilter={mockFilter}
        column={column as unknown as ColumnInstanceWithProps<any>}
      >
        Agency
      </ColumnFilter>,
    );
    // Open
    const filterButton = getByText('Agency');
    await waitFor(() => {
      fireEvent.click(filterButton!);
    });
    expect(useFormikContextMock).toHaveBeenCalledTimes(3);
  });

  // Skipped because: Cannot get handleClick to follow open path
  xit('Close a filter', async () => {
    reactMock.mockReturnValue([true, setState]);
    const { getByText } = render(
      <ColumnFilter onFilter={mockFilter} column={column}>
        Agency
      </ColumnFilter>,
    );

    // Close
    const filterButton = getByText('Agency');
    await waitFor(() => {
      fireEvent.click(filterButton!);
    });
    expect(setState).toHaveBeenCalledTimes(1);
  });

  // Skipped because: Cannot seem to select the input field
  xit('Populate open filter, use enter to submit', async () => {
    reactMock.mockReturnValue([true, setState]);
    const { container, getByText } = render(
      <ColumnFilter
        onFilter={mockFilter}
        column={column as unknown as ColumnInstanceWithProps<any>}
      >
        Agency
      </ColumnFilter>,
    );
    // Open
    const field = getByText('Filter by agency');
    await waitFor(() => {
      fireEvent.focus(field!);
      userEvent.type(field!, 'advance');
      userEvent.keyboard('Enter');
    });
    expect(container.querySelector('#filter-active')).toBeInTheDocument();
  });

  it('Open active filter', async () => {
    reactMock.mockReturnValue([false, setState]);
    useFormikContextMock.mockReturnValue({
      values: {
        searchBy: 'address',
        pid: '',
        address: '',
        administrativeArea: '',
        name: '',
        projectNumber: '',
        agencies: ['1'],
        classificationId: '',
        minLotSize: '',
        maxLotSize: '',
        rentableArea: '',
        propertyType: 'Land',
        maxAssessedValue: '',
        maxNetBookValue: '',
        inSurplusPropertyProgram: false,
        inEnhancedReferralProcess: false,
        surplusFilter: false,
      },
    } as unknown as any);
    const { getByText } = render(
      <ColumnFilter
        onFilter={mockFilter}
        column={column as unknown as ColumnInstanceWithProps<any>}
      >
        Agency
      </ColumnFilter>,
    );
    // Open
    const filterButton = getByText('Agency');
    await waitFor(() => {
      fireEvent.click(filterButton!);
    });
    expect(useFormikContextMock).toHaveBeenCalledTimes(3);
  });

  it('Trigger column missing filter error', () => {
    reactMock.mockReturnValue([false, setState]);
    const badColumn = {
      Header: 'Agency',
      align: 'left',
      responsive: true,
      width: 1.75,
      minWidth: 80,
      clickable: true,
      sortable: true,
      filterable: true,
      depth: 0,
      id: 'agencyCode',
      maxWidth: 9007199254740991,
      sortType: 'alphanumeric',
      sortDescFirst: false,
      canResize: true,
      originalWidth: 1.75,
      isVisible: true,
      totalVisibleHeaderCount: 1,
      totalLeft: 0,
      totalMinWidth: 80,
      totalWidth: 80,
      totalMaxWidth: 9007199254740991,
      totalFlexWidth: 80,
      canSort: true,
      isSorted: false,
      sortedIndex: -1,
      toggleHidden: jest.fn(),
      toggleSortBy: jest.fn(),
      render: jest.fn(),
    };

    expect(() =>
      render(
        <ColumnFilter
          onFilter={mockFilter}
          column={badColumn as unknown as ColumnInstanceWithProps<any>}
        ></ColumnFilter>,
      ),
    ).toThrowError();
  });
});
