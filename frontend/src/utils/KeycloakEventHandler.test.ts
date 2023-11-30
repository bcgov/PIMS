import Keycloak from 'keycloak-js';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as jwtSlice from 'store/slices/jwtSlice';
import { initialJwtState } from 'store/slices/jwtSlice';
import * as keycloakReadySlice from 'store/slices/keycloakReadySlice';
import { initialKeycloakState } from 'store/slices/keycloakReadySlice';

import getKeycloakEventHandler from './KeycloakEventHandler';

const mockStore = configureMockStore([thunk]);
const store = mockStore({
  jwt: initialJwtState,
  keycloakReady: initialKeycloakState,
});

const dispatchSpy = jest.spyOn(store, 'dispatch');
const saveJwtSpy = jest.spyOn(jwtSlice, 'saveJwt');
const clearJwtSpy = jest.spyOn(jwtSlice, 'clearJwt');
const setKeycloakReadySpy = jest.spyOn(keycloakReadySlice, 'setKeycloakReady');
// Mock console functions to avoid large amounts of printouts in tests
jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'debug').mockImplementation(() => {});
jest.spyOn(console, 'group').mockImplementation(() => {});

const keycloak = {
  subject: 'test',
  userInfo: {
    roles: [],
    agencies: ['1'],
  },
  token: '123456789',
} as any as Keycloak;

const keyclockEventHandler = getKeycloakEventHandler(keycloak);

describe('KeycloakEventHandler ', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('saves the token when onAuthSuccess event is fired', () => {
    keyclockEventHandler('onAuthSuccess');
    expect(saveJwtSpy).toHaveBeenCalledWith(keycloak.token);
  });
  it('saves the token when onAuthRefreshSuccess event is fired', () => {
    keyclockEventHandler('onAuthRefreshSuccess');
    expect(saveJwtSpy).toHaveBeenCalledWith(keycloak.token);
  });
  it('clears the token when onAuthLogout event is fired', () => {
    keyclockEventHandler('onAuthLogout');
    expect(clearJwtSpy).toHaveBeenCalled();
  });
  it('clears the token when onTokenExpired event is fired', () => {
    keyclockEventHandler('onTokenExpired');
    expect(clearJwtSpy).toHaveBeenCalled();
  });
  it('sets the ready flag when onReady event is fired', () => {
    keyclockEventHandler('onReady');
    expect(setKeycloakReadySpy).toHaveBeenCalledWith(true);
  });
  it('does nothing when an unexpected event is fired', () => {
    keyclockEventHandler('onInitError');
    expect(dispatchSpy).not.toHaveBeenCalled();
    expect(saveJwtSpy).not.toHaveBeenCalled();
    expect(clearJwtSpy).not.toHaveBeenCalled();
    expect(setKeycloakReadySpy).not.toHaveBeenCalled();
  });
});
