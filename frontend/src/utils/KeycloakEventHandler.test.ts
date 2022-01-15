import { KeycloakInstance } from 'keycloak-js';
import getKeycloakEventHandler from './KeycloakEventHandler';
import { saveJwt, clearJwt } from 'store/slices/JwtSlice';
import { setKeycloakReady } from 'store/slices/keycloakReadySlice';
import { store } from 'store';

jest.mock('reducers/JwtSlice', () => ({
  saveJwt: jest.fn(),
  clearJwt: jest.fn(),
}));
jest.mock('reducers/keycloakReadySlice');
jest.mock('store', () => ({
  store: {
    dispatch: jest.fn(),
  },
}));

const keycloak = ({
  subject: 'test',
  userInfo: {
    roles: [],
    agencies: ['1'],
  },
  token: '123456789',
} as any) as KeycloakInstance;
const keyclockEventHandler = getKeycloakEventHandler(keycloak);
describe('KeycloakEventHandler ', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('saves the token when onAuthSuccess event is fired', () => {
    keyclockEventHandler('onAuthSuccess');
    expect(saveJwt).toHaveBeenCalledWith(keycloak.token);
  });
  it('saves the token when onAuthRefreshSuccess event is fired', () => {
    keyclockEventHandler('onAuthRefreshSuccess');
    expect(saveJwt).toHaveBeenCalledWith(keycloak.token);
  });
  it('clears the token when onAuthLogout event is fired', () => {
    keyclockEventHandler('onAuthLogout');
    expect(clearJwt).toHaveBeenCalled();
  });
  it('clears the token when onTokenExpired event is fired', () => {
    keyclockEventHandler('onTokenExpired');
    expect(clearJwt).toHaveBeenCalled();
  });
  it('sets the ready flag when onReady event is fired', () => {
    keyclockEventHandler('onReady');
    expect(setKeycloakReady).toHaveBeenCalledWith(true);
  });
  it('does nothing when an unexpected event is fired', () => {
    keyclockEventHandler('onInitError');
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(saveJwt).not.toHaveBeenCalled();
    expect(clearJwt).not.toHaveBeenCalled();
    expect(setKeycloakReady).not.toHaveBeenCalled();
  });
});
