import {
  getMostRecentAppraisal,
  getCurrentFiscal,
  getMostRecentEvaluation,
  getFlatProjectNotes,
  toFlatProject,
  toApiProject,
} from './projectConverter';
import moment, { Moment } from 'moment';
import { IEvaluation, IFiscal } from 'actions/parcelsActions';
import { EvaluationKeys } from 'constants/evaluationKeys';
import { FiscalKeys } from 'constants/fiscalKeys';
import { mockApiProject, mockFlatProject } from '../dispose/testUtils';
import { NoteTypes } from '../../../constants';

const createAppraisal = (date: Moment): IEvaluation => {
  return {
    key: EvaluationKeys.Appraised,
    value: 123,
    date: date.format('YYYY-MM-DD'),
  };
};

const createFiscal = (year: number): IFiscal => {
  return {
    key: FiscalKeys.Market,
    value: 123,
    fiscalYear: year,
  };
};

describe('projectConverter function tests', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  describe('getMostRecentAppraisal', () => {
    it('returns undefined if passed an empty list of evaluations', () => {
      expect(getMostRecentAppraisal([])).toBeUndefined();
    });
    it('returns undefined if there are no appraisals within a year of the current date', () => {
      const appraisal = createAppraisal(moment().add(2, 'years'));
      expect(getMostRecentAppraisal([appraisal])).toBeUndefined();
    });
    it('returns the most recent appraisal if there is an appraisal within a year of the current date', () => {
      const appraisal = createAppraisal(moment().add(300, 'days'));
      expect(getMostRecentAppraisal([appraisal])).toBe(appraisal);
    });
    it('returns the most recent appraisal if there are multiple appraisals within a year of the current date', () => {
      const appraisals = [];
      appraisals.push(createAppraisal(moment().subtract(1, 'days')));
      appraisals.push(createAppraisal(moment().subtract(2, 'days')));
      expect(getMostRecentAppraisal(appraisals)).toBe(appraisals[0]);
    });
    it('returns the most recent appraisal if there are multiple appraisals within a year of the disposal date', () => {
      const appraisals = [];
      const disposalDate = moment('2018-01-01');
      appraisals.push(createAppraisal(disposalDate.subtract(1, 'days')));
      appraisals.push(createAppraisal(disposalDate.subtract(2, 'days')));
      appraisals.push(createAppraisal(moment().subtract(1, 'days')));
      expect(getMostRecentAppraisal(appraisals, '2018-01-01')).toBe(appraisals[0]);
    });
    it('returns undefined if there are no appraisals within a year of the disposal date', () => {
      const disposalDate = moment('2018-01-01');
      const appraisal = createAppraisal(disposalDate.add(366, 'days'));
      expect(getMostRecentAppraisal([appraisal], '2018-01-01')).toBeUndefined();
    });
  });
  describe('getCurrentFiscal', () => {
    it('returns undefined if passed an empty array', () => {
      expect(getCurrentFiscal([], FiscalKeys.Market)).toBeUndefined();
    });
    it('returns the most recent fiscal', () => {
      const fiscals = [];
      fiscals.push(createFiscal(2020));
      fiscals.push(createFiscal(2021));
      fiscals.push(createFiscal(2018));
      expect(getCurrentFiscal(fiscals, FiscalKeys.Market)).toBe(fiscals[1]);
    });
  });
  describe('getMostRecentEvaluation', () => {
    it('returns undefined if passed an empty array', () => {
      expect(getMostRecentEvaluation([], EvaluationKeys.Assessed)).toBeUndefined();
    });
    it('returns the most recent evaluation', () => {
      const evaluations = [];
      evaluations.push(createAppraisal(moment('2018-01-01')));
      evaluations.push(createAppraisal(moment('2021-01-01')));
      evaluations.push(createAppraisal(moment('2020-01-01')));
      expect(getMostRecentEvaluation(evaluations, EvaluationKeys.Appraised)).toBe(evaluations[1]);
    });
  });
  describe('getFlatProjectNotes', () => {
    it('returns an array with all note types', () => {
      expect(getFlatProjectNotes({ notes: [] } as any)).toHaveLength(
        Object.keys(NoteTypes).filter((val: any) => isNaN(val)).length,
      );
    });
  });
  describe('toFlatProject', () => {
    it('returns undefined if given an invalid project', () => {
      expect(toFlatProject(undefined)).toBeUndefined();
    });
    it('converts an api project to flat project', () => {
      expect(toFlatProject(mockApiProject as any)).toMatchObject(mockFlatProject);
    });
  });
  describe('toApiProject', () => {
    it('converts a flat project to an api project', () => {
      expect(toApiProject(mockFlatProject as any)).toBeTruthy();
    });
  });
});
