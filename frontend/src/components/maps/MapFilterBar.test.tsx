import React from 'react';
import renderer from 'react-test-renderer';
import { render, wait, fireEvent } from '@testing-library/react';
import MapFilterBar, { MapFilterChangeEvent } from './MapFilterBar';
import * as MOCK from 'mocks/filterDataMock';
import Axios from 'axios';

const onFilterChange = jest.fn<void, [MapFilterChangeEvent]>();
//prevent web calls from being made during tests.
jest.mock('axios');
const mockedAxios = Axios as jest.Mocked<typeof Axios>;

describe('MapFilterBar', () => {
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

  it('submits correct values', async () => {
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
    const municipality = container.querySelector('input[name="municipality"]');
    const projectNumber = container.querySelector('input[name="projectNumber"]');
    const agencies = container.querySelector('select[name="agencies"]');
    const classificationId = container.querySelector('select[name="classificationId"]');
    const minLotSize = container.querySelector('select[name="minLotSize"]');
    const maxLotSize = container.querySelector('select[name="maxLotSize"]');
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
      fireEvent.change(municipality!, {
        target: {
          value: 'mockmunicipality',
        },
      });
    });

    await wait(() => {
      fireEvent.change(projectNumber!, {
        target: {
          value: 'mock-project-number',
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
    expect(onFilterChange).toBeCalledWith<[MapFilterChangeEvent]>({
      address: 'mockaddress',
      municipality: 'mockmunicipality',
      projectNumber: 'mock-project-number',
      agencies: '1',
      classificationId: '0',
      minLotSize: '1',
      maxLotSize: '3',
    });
  });
});
