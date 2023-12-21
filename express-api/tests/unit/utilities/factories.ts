/* eslint-disable @typescript-eslint/no-explicit-any */
import sinon from 'sinon';
import { Request, Response } from 'express';

export class MockRes {
  statusValue: any;
  status = sinon.fake((value: any) => {
    this.statusValue = value;

    return this;
  });

  jsonValue: any;
  json = sinon.fake((value: any) => {
    this.jsonValue = value;

    return this;
  });

  sendValue: any;
  send = sinon.fake((value: any) => {
    this.sendValue = value;

    return this;
  });
}

export class MockReq {
  query = {};
  params = {};
  body = {};
  files: any[] = [];
}

/**
 * Returns several mocks for testing RequestHandler responses.
 *
 * @return {*}
 */
export const getRequestHandlerMocks = () => {
  const mockReq = new MockReq() as Request & MockReq;

  const mockRes = new MockRes() as Response & MockRes;

  //const mockNext; May need to implement this as well.

  return { mockReq, mockRes /*mockNext*/ };
};
