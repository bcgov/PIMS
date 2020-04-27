import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { getFetchLookupCodeAction } from 'actionCreators/lookupCodeActionCreator';
import * as genericActions from 'actions/genericActions';
import * as API from 'constants/API';
import * as MOCK from 'mocks/dataMocks';
import { ENVIRONMENT } from 'constants/environment';

const dispatch = jest.fn();
const requestSpy = jest.spyOn(genericActions, 'request');
const successSpy = jest.spyOn(genericActions, 'success');
const errorSpy = jest.spyOn(genericActions, 'error');
const mockAxios = new MockAdapter(axios);

beforeEach(() => {
  mockAxios.reset();
  dispatch.mockClear();
  requestSpy.mockClear();
  successSpy.mockClear();
  errorSpy.mockClear();
});

describe('getFetchLookupCodeAction action creator', () => {
  it('gets all codes when paramaters contains all', () => {
    const url = ENVIRONMENT.apiUrl + API.LOOKUP_CODE_SET('all');
    const mockResponse = { data: { success: true } };
    mockAxios.onGet(url).reply(200, mockResponse);
    return getFetchLookupCodeAction()(dispatch)
      .then(() => {
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(successSpy).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledTimes(6);
      })
      .catch(() => {
        fail('it should not reach here');
      });
  });

  it('Request failure, dispatches `error` with correct response', () => {
    const url = ENVIRONMENT.apiUrl + API.LOOKUP_CODE_SET('all');
    mockAxios.onGet(url).reply(400, MOCK.ERROR);
    return getFetchLookupCodeAction()(dispatch)
      .then(() => {
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledTimes(4);
      })
      .catch(() => {
        fail('it should not reach here');
      });
  });
});
