import { useFormikContext } from 'formik';

import { PropertyColumns } from './PropertyColumns';

jest.mock('formik', () => ({
  useFormikContext: jest.fn(),
}));

describe('PropertyColumns', () => {
  beforeEach(() => {
    (useFormikContext as jest.Mock).mockReturnValue({
      setFieldValue: jest.fn(),
    });
  });

  it('should return the expected number of columns', () => {
    const columns = PropertyColumns();
    expect(columns.length).toBe(12);
  });

  it('should return the expected first column', () => {
    const columns = PropertyColumns();
    expect(columns[0]).toEqual({
      accessor: 'id',
      align: 'left',
      clickable: false,
      maxWidth: 30,
      Cell: expect.any(Function),
    });
  });

  it('should return the expected second column', () => {
    const columns = PropertyColumns();
    expect(columns[1]).toEqual({
      Header: 'Agency',
      accessor: 'agencyCode',
      align: 'left',
      clickable: false,
      maxWidth: 50,
    });
  });
});
