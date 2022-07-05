import { initialKeycloakState, keycloakReadySlice, setKeycloakReady } from './keycloakReadySlice';

describe('Keycloak ready slice tests', () => {
  const reducer = keycloakReadySlice.reducer;

  it('Should return initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialKeycloakState);
  });

  it('Should store keycloak ready state', () => {
    const state = true;
    expect(reducer(undefined, setKeycloakReady(state))).toEqual(state);
  });
});
