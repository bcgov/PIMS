import { ILookupCode } from 'actions/ILookupCode';

import { initialLookupCodeState, lookupCodeSlice, storeLookupCodes } from './lookupCodeSlice';

describe('LookupCode slice tests', () => {
  const reducer = lookupCodeSlice.reducer;

  it('Should return initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialLookupCodeState);
  });

  it('Should store lookup codes', () => {
    const codes: ILookupCode[] = [
      {
        id: '1',
        code: 'CODE',
        name: 'name',
        isDisabled: false,
        isPublic: true,
        isVisible: true,
        type: 'LookupCode',
        sortOrder: 0,
      },
    ];
    expect(reducer(undefined, storeLookupCodes(codes))).toEqual({
      ...initialLookupCodeState,
      lookupCodes: codes,
    });
  });
});
