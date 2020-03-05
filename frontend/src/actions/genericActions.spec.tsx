import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { request, success, error } from 'actions/genericActions';
import * as ReducerTypes from 'constants/reducerTypes';
import * as ActionTypes from 'constants/actionTypes';

const createMockStore = configureMockStore([thunk]);
const store = createMockStore({
  rootReducer: {
    parcels: [],
    parcelDetail: null,
    pid: 0,
  },
});

describe('genericActions', () => {
  afterEach(() => {
    store.clearActions();
  });

  it('`request action` returns `type: REQUEST`', () => {
    const expectedActions = [
      { name: ReducerTypes.GET_PARCELS, type: ActionTypes.REQUEST, isFetching: true },
    ];

    store.dispatch(request(ReducerTypes.GET_PARCELS));
    expect(store.getActions()).toEqual(expectedActions);
  });

  describe('after a `request` action', () => {
    it('when an API endpoint has been successful, the `success` action returns `type: SUCCESS`', () => {
      const mockData = {};
      const expectedActions = [
        { name: ReducerTypes.GET_PARCELS, type: ActionTypes.REQUEST, isFetching: true },
        {
          name: ReducerTypes.GET_PARCELS,
          type: ActionTypes.SUCCESS,
          data: mockData,
          isFetching: false,
          status: 200,
        },
      ];

      store.dispatch(request(ReducerTypes.GET_PARCELS));
      store.dispatch(success(ReducerTypes.GET_PARCELS, 200, mockData));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('when an API endpoint has failed, the `error` action returns `type: ERROR`', () => {
      const mockError = { response: { status: 400, data: { errors: [], message: 'Error' } } };
      const expectedActions = [
        { name: ReducerTypes.GET_PARCELS, type: ActionTypes.REQUEST, isFetching: true },
        {
          name: ReducerTypes.GET_PARCELS,
          type: ActionTypes.ERROR,
          errorMessage: mockError,
          isFetching: false,
          status: 400,
        },
      ];
      store.dispatch(request(ReducerTypes.GET_PARCELS));
      store.dispatch(error(ReducerTypes.GET_PARCELS, 400, mockError));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
