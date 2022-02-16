import {
  clear,
  error,
  initialNetworkState,
  networkSlice,
  request,
  storeError,
  storeRequest,
  storeSuccess,
  success,
} from './networkSlice';

describe('Network slice tests', () => {
  const reducer = networkSlice.reducer;

  it('Should return default state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialNetworkState);
  });

  it('Should return request action result', () => {
    expect(reducer({}, request('request'))).toEqual({
      request: {
        isFetching: true,
        name: 'request',
        type: storeRequest.type,
      },
    });
  });

  it('Should return success action result', () => {
    expect(reducer({}, success('success', 200, []))).toEqual({
      success: {
        isFetching: false,
        name: 'success',
        status: 200,
        type: storeSuccess.type,
        data: [],
      },
    });
  });

  it('Should return error action result', () => {
    expect(reducer({}, error('error', 400, {}))).toEqual({
      error: {
        isFetching: false,
        name: 'error',
        status: 400,
        error: {},
        type: storeError.type,
      },
    });
  });

  it('Should return a clear action result', () => {
    expect(reducer({}, clear('clear'))).toEqual({
      clear: {
        isFetching: false,
        name: 'clear',
      },
    });
  });
});
