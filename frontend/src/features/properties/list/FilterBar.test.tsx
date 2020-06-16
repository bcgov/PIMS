import React from 'react';
import renderer from 'react-test-renderer';
import { render, wait, fireEvent, cleanup } from '@testing-library/react';
import FilterBar, { IFilterBarState } from './FilterBar';
import * as MOCK from 'mocks/filterDataMock';
import Axios from 'axios';

const onFilterChange = jest.fn<void, [IFilterBarState]>();
//prevent web calls from being made during tests.
jest.mock('axios');
const mockedAxios = Axios as jest.Mocked<typeof Axios>;

describe('FilterBar', () => {
  afterEach(() => {
    cleanup();
  });
  it('renders correctly', () => {
    // Capture any changes
    const tree = renderer
      .create(
        <FilterBar
          agencyLookupCodes={MOCK.AGENCIES}
          propertyClassifications={MOCK.CLASSIFICATIONS}
          onChange={onFilterChange}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('submits correct values', async () => {
    // Arrange
    mockedAxios.get.mockImplementationOnce(() => Promise.resolve({}));
    const uiElement = (
      <FilterBar
        agencyLookupCodes={MOCK.AGENCIES}
        propertyClassifications={MOCK.CLASSIFICATIONS}
        onChange={onFilterChange}
      />
    );
    const { container } = render(uiElement);
    const address = container.querySelector('input[name="address"]');
    const agencies = container.querySelector('select[name="agencies"]');
    const classificationId = container.querySelector('select[name="classificationId"]');
    const minLotSize = container.querySelector('input[name="minLotSize"]');
    const maxLotSize = container.querySelector('input[name="maxLotSize"]');
    const submit = container.querySelector('button[type="submit"]');

    // Act
    // Enter values on the form fields, then click the Search button
    await wait(() => {
      fireEvent.change(address!, {
        target: {
          value: 'mockaddress',
        },
      });
    });

    await wait(() => {
      fireEvent.change(agencies!, {
        target: {
          value: '1',
        },
      });
    });

    await wait(() => {
      fireEvent.change(classificationId!, {
        target: {
          value: '0',
        },
      });
    });

    await wait(() => {
      fireEvent.change(minLotSize!, {
        target: {
          value: '1',
        },
      });
    });

    await wait(() => {
      fireEvent.change(maxLotSize!, {
        target: {
          value: '3',
        },
      });
    });

    await wait(() => {
      fireEvent.click(submit!);
    });

    // Assert
    expect(onFilterChange).toBeCalledWith<[IFilterBarState]>({
      searchBy: 'address',
      address: 'mockaddress',
      municipality: '',
      projectNumber: '',
      agencies: '1',
      classificationId: '0',
      minLotSize: '1',
      maxLotSize: '3',
    });
  });
});
