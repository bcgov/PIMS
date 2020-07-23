import { getMostRecentAppraisal } from './projectConverter';
import moment, { Moment } from 'moment';
import { IEvaluation } from 'actions/parcelsActions';
import { EvaluationKeys } from 'constants/evaluationKeys';

const createAppraisal = (date: Moment): IEvaluation => {
  return {
    key: EvaluationKeys.Appraised,
    value: 123,
    date: date.format('YYYY-MM-DD'),
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
      const appraisal = createAppraisal(moment().add(366, 'days'));
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
});
