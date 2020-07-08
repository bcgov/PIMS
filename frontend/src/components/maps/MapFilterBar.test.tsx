import React from 'react';
import renderer from 'react-test-renderer';
import { render, wait, fireEvent, cleanup } from '@testing-library/react';
import MapFilterBar, { MapFilterChangeEvent } from './MapFilterBar';
import * as MOCK from 'mocks/filterDataMock';
import Axios from 'axios';

const onFilterChange = jest.fn<void, [MapFilterChangeEvent]>();
//prevent web calls from being made during tests.
jest.mock('axios');
const mockedAxios = Axios as jest.Mocked<typeof Axios>;

describe('MapFilterBar', () => {
  afterEach(() => {
    cleanup();
  });
  it('renders correctly', () => {
    // Capture any changes
    const tree = renderer
      .create(
        <MapFilterBar
          agencyLookupCodes={MOCK.AGENCIES}
          propertyClassifications={MOCK.CLASSIFICATIONS}
          lotSizes={[1, 2, 3]}
          onFilterChange={onFilterChange}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  xit('submits correct values', async () => {
    // Arrange
    mockedAxios.get.mockImplementationOnce(() => Promise.resolve({}));
    const uiElement = (
      <MapFilterBar
        agencyLookupCodes={MOCK.AGENCIES}
        propertyClassifications={MOCK.CLASSIFICATIONS}
        lotSizes={[1, 2, 3]}
        onFilterChange={onFilterChange}
      />
    );
    const { container } = render(uiElement);
    const address = container.querySelector('input[name="address"]');
    const agencies = container.querySelector('input[name="agencies"]');
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
          value: '2',
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
    expect(onFilterChange).toBeCalledWith<[MapFilterChangeEvent]>({
      searchBy: 'address',
      address: 'mockaddress',
      municipality: '',
      projectNumber: '',
      agencies: '2',
      classificationId: '0',
      minLotSize: '1',
      maxLotSize: '3',
    });
  });
});
