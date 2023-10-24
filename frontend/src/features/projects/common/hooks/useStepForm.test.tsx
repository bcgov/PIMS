import useStepForm from 'features/projects/common/hooks/useStepForm';
import { IProject } from 'features/projects/interfaces';
import { FormikValues } from 'formik';
import React from 'react';

// Setup Mocks
jest.mock('store', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn().mockReturnValue(undefined),
}));

jest.mock('store/slices/hooks', () => ({
  useNetworkStore: () => ({
    clearRequest: jest.fn(),
  }),
}));

jest.mock('hooks/useKeycloakWrapper', () =>
  jest.fn().mockReturnValue(() => ({
    hasRole: jest.fn().mockReturnValue(true),
    hasAgency: jest.fn().mockReturnValue(true),
    hasClaim: jest.fn().mockReturnValue(true),
  })),
);

// Need these to fail for now. Re-mock if you need resolved promises
jest.mock('..', () => ({
  // createProject is a function that returns another function that returns a promise
  createProject: jest.fn().mockReturnValue(
    () =>
      new Promise((resolve, reject) => {
        reject({
          response: {
            data: {
              error: 'Test error',
            },
          },
        });
      }),
  ),
  updateProject: jest.fn().mockReturnValue(
    () =>
      new Promise((resolve, reject) => {
        reject({
          response: {
            data: {
              error: 'Test error',
            },
          },
        });
      }),
  ),
}));

const formikRef: React.MutableRefObject<FormikValues | undefined> = {
  current: {
    setStatus: jest.fn(),
  },
};

const project: IProject = {
  projectNumber: '',
  name: '',
  description: '',
  fiscalYear: 2023,
  properties: [],
  projectAgencyResponses: [],
  note: '',
  notes: [],
  publicNote: '',
  privateNote: '',
  agencyId: 1,
  statusId: 0,
  tierLevelId: 0,
  tasks: [],
  statusHistory: [],
};

describe('Testing useStepForm Functions', () => {
  it('addOrUpdateProject throws axios error when axios fails', async () => {
    const { addOrUpdateProject } = useStepForm();
    try {
      await addOrUpdateProject(project, formikRef);
      expect(false).toBeTruthy(); // Fail if the above doesn't throw
    } catch (e: unknown) {
      expect((e as { message: string }).message).toBe('Axios request failed: Test error');
    }

    // Not sure why this doesn't work for this test. Above isn't optimal, but still tests Error.
    // expect(async () => {
    //   await addOrUpdateProject(project, formikRef);
    // }).toThrowError();
  });
});
