import React from 'react';
import renderer from 'react-test-renderer';
import { render, wait, fireEvent, cleanup } from '@testing-library/react';
import MapFilterBar, { MapFilterChangeEvent } from './MapFilterBar';
import * as MOCK from 'mocks/filterDataMock';
import Axios from 'axios';
import { useKeycloak } from '@react-keycloak/web';

const onFilterChange = jest.fn<void, [MapFilterChangeEvent]>();
//prevent web calls from being made during tests.
jest.mock('axios');
jest.mock('@react-keycloak/web');
const mockedAxios = Axios as jest.Mocked<typeof Axios>;

const getUiElement = (filter?: MapFilterChangeEvent) => (
  <MapFilterBar
    agencyLookupCodes={MOCK.AGENCIES}
    propertyClassifications={MOCK.CLASSIFICATIONS}
    mapFilter={filter}
    lotSizes={[1, 2, 3]}
    onFilterChange={onFilterChange}
  />
);

describe('MapFilterBar', () => {
  afterEach(() => {
    cleanup();
  });
  beforeEach(() => {
    (useKeycloak as jest.Mock).mockReturnValue({
      keycloak: {
        subject: 'test',
        userInfo: {
          roles: ['property-view'],
        },
      },
    });
  });
  it('renders correctly', () => {
    (useKeycloak as jest.Mock).mockReturnValue({
      keycloak: {
        subject: 'test',
        userInfo: {
          roles: ['property-view'],
        },
      },
    });
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
    (useKeycloak as jest.Mock).mockReturnValue({
      keycloak: {
        subject: 'test',
        userInfo: {
          roles: ['admin-properties'],
        },
      },
    });
    mockedAxios.get.mockImplementationOnce(() => Promise.resolve({}));

    const { container } = render(getUiElement());
    const address = container.querySelector('input[name="address"]');
    const agencies = container.querySelector('input[name="agencies"]');
    const classificationId = container.querySelector('select[name="classificationId"]');
    const minLotSize = container.querySelector('input[name="minLotSize"]');
    const maxLotSize = container.querySelector('input[name="maxLotSize"]');
    const inSurplusPropertyProgram = container.querySelector(
      'input[name="inSurplusPropertyProgram"]',
    );
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
      fireEvent.click(inSurplusPropertyProgram!);
    });

    await wait(() => {
      fireEvent.click(submit!);
    });

    // Assert
    expect(onFilterChange).toBeCalledWith<[MapFilterChangeEvent]>({
      pid: 'mockPid',
      searchBy: 'address',
      address: 'mockaddress',
      city: 'mockCity',
      municipality: '',
      projectNumber: '',
      agencies: '2',
      classificationId: '0',
      minLotSize: '1',
      maxLotSize: '3',
      inSurplusPropertyProgram: true,
    });
  });

  it('does not display SPP property filter for non-sres users', () => {
    const { queryByText } = render(getUiElement());
    expect(queryByText('Properties in SPP')).toBeNull();
  });

  it('loads filter values if provided', () => {
    const providedFilter = {
      pid: 'mockPid',
      searchBy: 'address',
      address: 'mockaddress',
      city: 'mockCity',
      municipality: '',
      projectNumber: '',
      agencies: '2',
      classificationId: '0',
      minLotSize: '10',
      maxLotSize: '20',
      inSurplusPropertyProgram: true,
    };
    const { getByText, getByPlaceholderText } = render(getUiElement(providedFilter));
    expect(getByText('Address')).toBeVisible();
    expect(getByText('Core Operational')).toBeVisible();
    expect(getByPlaceholderText('Min Lot Size')).toHaveValue('10');
    expect(getByPlaceholderText('Max Lot Size')).toHaveValue('20');
  });
});
