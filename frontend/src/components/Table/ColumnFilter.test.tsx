import { fireEvent, render, waitFor } from '@testing-library/react';
import ColumnFilter from 'components/Table/ColumnFilter';
import { ColumnInstanceWithProps } from 'components/Table/types';
import * as Formik from 'formik';
import React from 'react';

describe('Testing ColumnFilter.tsx', () => {
  const useFormikContextMock = jest.spyOn(Formik, 'useFormikContext');
  beforeEach(() => {
    useFormikContextMock.mockReturnValue({
      context: {
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
      },
    } as unknown as any);
  });

  const column = {
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

  const mockFilter = jest.fn();

  it('Open inactive filter', async () => {
    const { container } = render(
      <ColumnFilter
        onFilter={mockFilter}
        column={column as unknown as ColumnInstanceWithProps<any>}
      ></ColumnFilter>,
    );
    // Open
    const filterButton = container.querySelector('#filter-inactive');
    await waitFor(() => {
      fireEvent.click(filterButton!);
    });
    expect(useFormikContextMock).toHaveBeenCalledTimes(3);
  });

  it('Trigger column missing filter error', () => {
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
