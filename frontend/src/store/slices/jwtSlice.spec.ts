import { clearJwt, saveJwt, jwtSlice, initialJwtState } from './jwtSlice';

describe('JWT slice tests', () => {
  const reducer = jwtSlice.reducer;

  it('Should return initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialJwtState);
  });

  it('Should store the JWT', () => {
    const data = 'jwt';
    expect(reducer(undefined, saveJwt(data))).toEqual(data);
  });

  it('Should clear JWT', () => {
    expect(reducer('jwt', clearJwt())).toEqual('');
  });
});
