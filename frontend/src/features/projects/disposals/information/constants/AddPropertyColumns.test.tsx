import { AddPropertyColumns } from './AddPropertyColumns';

describe('AddPropertyColumns', () => {
  it('should render the add property columns correctly', () => {
    const onAddProperty = jest.fn();
    const props = { onAddProperty };
    const columns = AddPropertyColumns(props);

    expect(columns).toHaveLength(11);
    expect(columns[0]).toEqual({
      accessor: 'id',
      clickable: false,
      maxWidth: 30,
      Cell: expect.any(Function),
    });

    expect(columns[1]).toEqual({
      Header: 'Agency',
      accessor: 'agencyCode',
      align: 'left',
      clickable: false,
      maxWidth: 50,
    });

    expect(columns[2]).toEqual({
      Header: 'Name',
      accessor: 'name',
      align: 'left',
      clickable: false,
      Cell: expect.any(Function),
    });

    expect(columns[3]).toEqual({
      Header: 'Civic Address',
      accessor: 'address',
      align: 'left',
      clickable: true,
      Cell: expect.any(Function),
    });

    expect(columns[4]).toEqual({
      Header: 'Classification',
      accessor: expect.any(Function),
      align: 'left',
      clickable: false,
    });

    expect(columns[5]).toEqual({
      Header: 'Other Projects',
      accessor: 'projectNumbers',
      align: 'left',
      clickable: false,
      Cell: expect.any(Function),
    });

    expect(columns[6]).toEqual({
      Header: 'Net Book Value',
      accessor: 'netBook',
      align: 'left',
      clickable: false,
      Cell: expect.any(Function),
    });

    expect(columns[7]).toEqual({
      Header: 'Assessed Land',
      accessor: 'assessedLand',
      align: 'left',
      clickable: false,
      Cell: expect.any(Function),
    });

    expect(columns[8]).toEqual({
      Header: 'Assessed Year',
      accessor: expect.any(Function),
      clickable: false,
      maxWidth: 50,
    });

    expect(columns[9]).toEqual({
      Header: 'Assessed Building',
      accessor: 'assessedBuilding',
      align: 'left',
      clickable: false,
      Cell: expect.any(Function),
    });

    expect(columns[10]).toEqual({
      Header: 'Type',
      accessor: 'propertyTypeId',
      maxWidth: 40,
      clickable: false,
      Cell: expect.any(Function),
    });
  });
});
