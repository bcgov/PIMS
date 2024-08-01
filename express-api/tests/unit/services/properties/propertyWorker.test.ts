import { Roles } from '@/constants/roles';
import propertyServices, { BulkUploadRowResult } from '@/services/properties/propertiesServices';
import { processFile } from '@/services/properties/propertyWorker';
import { produceUser } from 'tests/testUtils/factories';
import xlsx from 'xlsx';

// Mock worker items
const _parentPortSpy = jest.fn().mockImplementation(() => {});
const workerDataObj = {
  filePath: 'testPath',
  resultRowId: 1,
  user: produceUser(),
  roles: [Roles.ADMIN],
};
jest.mock('worker_threads', () => ({
  parentPort: {
    postMessage: () => _parentPortSpy,
  },
  workerData: () => workerDataObj,
}));
// Spy on xlsx readFile
const _readFileSpy = jest.spyOn(xlsx, 'readFile').mockImplementation(() => ({
  ...new File([], 'test file'),
  Sheets: {
    sheet1: {},
  },
  SheetNames: ['sheet1'],
}));
// Mock appdatasource
const _saveSpy = jest.fn().mockImplementation(async () => {});
jest.mock('@/appDataSource', () => ({
  AppDataSource: {
    initialize: async () => {},
    getRepository: () => ({
      save: () => _saveSpy,
    }),
    destroy: async () => {},
  },
}));
// Spy on property services
const uploadResult: BulkUploadRowResult = {
  rowNumber: 0,
  action: 'inserted',
};
const _propServicesSpy = jest
  .spyOn(propertyServices, 'importPropertiesAsJSON')
  .mockImplementation(async () => [uploadResult]);

describe('UNIT - propertyWorker.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should return a set of results indicating the upload process has started', async () => {
    const result = await processFile('filePath', 0, produceUser(), [Roles.ADMIN]);
    expect(result.at(0).action).toBe('inserted');
    expect(_readFileSpy).toHaveBeenCalled();
  });

  it('should follow the catch route if an error is thrown', async () => {
    _readFileSpy.mockImplementationOnce(() => {
      throw new Error();
    });
    await processFile('filePath', 0, produceUser(), [Roles.ADMIN]);
    expect(_readFileSpy).toHaveBeenCalled();
    expect(_propServicesSpy).not.toHaveBeenCalled();
  });
});
