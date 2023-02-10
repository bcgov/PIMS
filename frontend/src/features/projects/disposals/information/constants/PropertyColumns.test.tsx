import { useFormikContext } from 'formik';
import { Mock, vi } from 'vitest';

import { PropertyColumns } from './PropertyColumns';

vi.mock('formik', () => ({
  useFormikContext: vi.fn(),
}));

describe('PropertyColumns', () => {
  beforeEach(() => {
    (useFormikContext as Mock).mockReturnValue({
      setFieldValue: vi.fn(),
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
