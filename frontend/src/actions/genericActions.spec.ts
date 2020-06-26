import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { request, success, error } from 'actions/genericActions';
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
      { name: ActionTypes.GET_PARCELS, type: ActionTypes.REQUEST, isFetching: true },
    ];

    store.dispatch<any>(request(ActionTypes.GET_PARCELS));
    expect(store.getActions()).toEqual(expectedActions);
  });

  describe('after a `request` action', () => {
    it('when an API endpoint has been successful, the `success` action returns `type: SUCCESS`', () => {
      const mockData = {};
      const expectedActions = [
        { name: ActionTypes.GET_PARCELS, type: ActionTypes.REQUEST, isFetching: true },
        {
          name: ActionTypes.GET_PARCELS,
          type: ActionTypes.SUCCESS,
          data: mockData,
          isFetching: false,
          status: 200,
        },
      ];

      store.dispatch<any>(request(ActionTypes.GET_PARCELS));
      store.dispatch(success(ActionTypes.GET_PARCELS, 200, mockData));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('when an API endpoint has failed, the `error` action returns `type: ERROR`', () => {
      const mockError = {
        response: { status: 400, error: { error: undefined, message: 'Error' }, data: undefined },
      };
      const expectedActions = [
        {
          name: ActionTypes.GET_PARCELS,
          type: ActionTypes.REQUEST,
          isFetching: true,
          error: undefined,
          status: undefined,
        },
        {
          name: ActionTypes.GET_PARCELS,
          type: ActionTypes.ERROR,
          error: mockError,
          isFetching: false,
          status: 400,
          data: undefined,
        },
      ];
      store.dispatch<any>(request(ActionTypes.GET_PARCELS));
      store.dispatch(error(ActionTypes.GET_PARCELS, 400, mockError));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
