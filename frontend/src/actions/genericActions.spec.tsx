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
    const expectedActions = [{ name: ReducerTypes.GET_PARCELS, type: ActionTypes.REQUEST }];

    store.dispatch(request(ReducerTypes.GET_PARCELS));
    expect(store.getActions()).toEqual(expectedActions);
  });

  describe('after a `request` action', () => {
    it('when an API endpoint has been successful, the `success` action returns `type: SUCCESS`', () => {
      const mockData = {};
      const expectedActions = [
        { name: ReducerTypes.GET_PARCELS, type: ActionTypes.REQUEST },
        { name: ReducerTypes.GET_PARCELS, type: ActionTypes.SUCCESS, data: mockData },
      ];

      store.dispatch(request(ReducerTypes.GET_PARCELS));
      store.dispatch(success(ReducerTypes.GET_PARCELS, mockData));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('when an API endpoint has failed, the `error` action returns `type: ERROR`', () => {
      const mockError = { response: { status: 400, data: { errors: [], message: 'Error' } } };
      const expectedActions = [
        { name: ReducerTypes.GET_PARCELS, type: ActionTypes.REQUEST },
        { name: ReducerTypes.GET_PARCELS, type: ActionTypes.ERROR, errorMessage: mockError },
      ];
      store.dispatch(request(ReducerTypes.GET_PARCELS));
      store.dispatch(error(ReducerTypes.GET_PARCELS, mockError));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
