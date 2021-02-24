import {
  getMostRecentAppraisal,
  getCurrentFiscal,
  getMostRecentEvaluation,
  getFlatProjectNotes,
  toFlatProject,
  toApiProject,
  toFlatProperty,
} from './projectConverter';
import moment, { Moment } from 'moment';
import { IEvaluation, IFiscal } from 'actions/parcelsActions';
import { EvaluationKeys } from 'constants/evaluationKeys';
import { FiscalKeys } from 'constants/fiscalKeys';
import {
  mockApiProject,
  mockFlatProject,
  mockApiProjectParcel,
  mockApiProjectBuilding,
} from '../dispose/testUtils';
import { NoteTypes, PropertyTypes } from '../../../constants';

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
  describe('toFlatProperty', () => {
    describe('evaluation population', () => {
      it('does not populate parcel evaluation fields if no evaluations present', () => {
        const apiProperty = { ...mockApiProjectParcel, evaluations: [] };
        const property = toFlatProperty(apiProperty as any);
        expect(property.assessedLand).toBe('');
        expect(property.assessedBuilding).toBe('');
      });
      it('does not populate building evaluation fields if no evaluations present', () => {
        const apiProperty = { ...mockApiProjectBuilding, evaluations: [] };
        const property = toFlatProperty(apiProperty as any);
        expect(property.assessedLand).toBe('');
        expect(property.assessedBuilding).toBe('');
      });
      it('populates parcel assessed fields properly', () => {
        const apiProperty = {
          ...mockApiProjectParcel,
          evaluations: [
            { key: EvaluationKeys.Assessed, value: 200, date: new Date() },
            { key: EvaluationKeys.Improvements, value: 300, date: new Date() },
          ] as IEvaluation[],
        };
        const property = toFlatProperty(apiProperty as any);
        expect(property.assessedLand).toBe(200);
        expect(property.assessedBuilding).toBe(300);
      });
      it('populates building assessed fields properly', () => {
        const apiProperty = {
          ...mockApiProjectBuilding,
          evaluations: [
            { key: EvaluationKeys.Assessed, value: 200, date: moment() },
            { key: EvaluationKeys.Improvements, value: 300 },
          ] as IEvaluation[],
        };
        const property = toFlatProperty(apiProperty as any);
        expect(property.assessedLand).toBe('');
        expect(property.assessedBuilding).toBe(200);
      });
      it('does not populate parcel assessed fields if all evaluations are too old', () => {
        const apiProperty = {
          ...mockApiProjectParcel,
          evaluations: [
            {
              key: EvaluationKeys.Assessed,
              value: 200,
              date: moment()
                .add(-1, 'years')
                .toDate(),
            },
            {
              key: EvaluationKeys.Improvements,
              value: 300,
              date: moment()
                .add(-1, 'years')
                .toDate(),
            },
          ] as IEvaluation[],
        };
        const property = toFlatProperty(apiProperty as any);
        expect(property.assessedLand).toBe('');
        expect(property.assessedBuilding).toBe('');
      });
      it('does not populate building assessed fields if all evaluations are too old', () => {
        const apiProperty = {
          ...mockApiProjectBuilding,
          evaluations: [
            {
              key: EvaluationKeys.Assessed,
              value: 200,
              date: moment()
                .add(-1, 'years')
                .toDate(),
            },
            {
              key: EvaluationKeys.Improvements,
              value: 300,
              date: moment()
                .add(-1, 'years')
                .toDate(),
            },
          ] as IEvaluation[],
        };
        const property = toFlatProperty(apiProperty as any);
        expect(property.assessedLand).toBe('');
        expect(property.assessedBuilding).toBe('');
      });
    });
    describe('fiscal population', () => {
      it('does not populate parcel fiscal fields if no fiscals present', () => {
        const apiProperty = { ...mockApiProjectParcel, fiscals: [], evaluations: [] };
        const property = toFlatProperty(apiProperty as any);
        expect(property.market).toBe('');
        expect(property.netBook).toBe('');
      });
      it('does not populate building fiscal fields if no fiscals present', () => {
        const apiProperty = { ...mockApiProjectBuilding, fiscals: [], evaluations: [] };
        const property = toFlatProperty(apiProperty as any);
        expect(property.market).toBe('');
        expect(property.netBook).toBe('');
      });
      it('populates parcel fiscal fields properly', () => {
        const apiProperty = {
          ...mockApiProjectParcel,
          evaluations: [],
          fiscals: [
            { key: FiscalKeys.Market, value: 200, fiscalYear: moment().year() },
            { key: FiscalKeys.NetBook, value: 300, fiscalYear: moment().year() },
          ] as IFiscal[],
        };
        const property = toFlatProperty(apiProperty as any);
        expect(property.market).toBe(200);
        expect(property.netBook).toBe(300);
      });
      it('populates building fiscal fields properly', () => {
        const apiProperty = {
          ...mockApiProjectBuilding,
          evaluations: [],
          fiscals: [
            { key: FiscalKeys.Market, value: 200, fiscalYear: moment().year() },
            { key: FiscalKeys.NetBook, value: 300, fiscalYear: moment().year() },
          ] as IFiscal[],
        };
        const property = toFlatProperty(apiProperty as any);
        expect(property.market).toBe(200);
        expect(property.netBook).toBe(300);
      });
      it('does not populate parcel fiscal fields if all fiscals are too old', () => {
        const apiProperty = {
          ...mockApiProjectParcel,
          evaluations: [],
          fiscals: [
            {
              key: FiscalKeys.Market,
              value: 200,
              fiscalYear: moment()
                .add(-1, 'years')
                .year(),
            },
            {
              key: FiscalKeys.NetBook,
              value: 300,
              fiscalYear: moment()
                .add(-1, 'years')
                .year(),
            },
          ] as IFiscal[],
        };
        const property = toFlatProperty(apiProperty as any);
        expect(property.market).toBe('');
        expect(property.netBook).toBe('');
      });
      it('does not populate building fiscal fields if all fiscals are too old', () => {
        const apiProperty = {
          ...mockApiProjectBuilding,
          evaluations: [],
          fiscals: [
            {
              key: FiscalKeys.Market,
              value: 200,
              fiscalYear: moment()
                .add(-1, 'years')
                .year(),
            },
            {
              key: FiscalKeys.NetBook,
              value: 300,
              fiscalYear: moment()
                .add(-1, 'years')
                .year(),
            },
          ] as IFiscal[],
        };
        const property = toFlatProperty(apiProperty as any);
        expect(property.market).toBe('');
        expect(property.netBook).toBe('');
      });
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
    it('does not add evaluations or fiscals to the parcel for empty values', () => {
      const flatProject = {
        ...mockFlatProject,
        properties: [
          {
            ...mockFlatProject.properties[0],
            propertyTypeId: PropertyTypes.PARCEL,
            assessedLand: '',
            assessedBuilding: '',
            market: '',
            netBook: '',
          },
        ],
      };
      expect(toApiProject(flatProject as any).properties[0].parcel?.evaluations).toHaveLength(0);
      expect(toApiProject(flatProject as any).properties[0].parcel?.fiscals).toHaveLength(0);
    });
    it('does not add evaluations or fiscals to the building for empty values', () => {
      const flatProject = {
        ...mockFlatProject,
        properties: [
          {
            ...mockFlatProject.properties[0],
            propertyTypeId: PropertyTypes.BUILDING,
            assessedLand: '',
            assessedBuilding: '',
            market: '',
            netBook: '',
          },
        ],
      };
      expect(toApiProject(flatProject as any).properties[0].building?.evaluations).toHaveLength(0);
      expect(toApiProject(flatProject as any).properties[0].building?.fiscals).toHaveLength(0);
    });
    it('adds an assessment evaluation to a parcel when assessedLand is populated', () => {
      const flatProject = {
        ...mockFlatProject,
        properties: [
          {
            ...mockFlatProject.properties[0],
            propertyTypeId: PropertyTypes.PARCEL,
            assessedLand: 200,
            assessedBuilding: '',
          },
        ],
      };
      const apiProject = toApiProject(flatProject as any);
      expect(apiProject.properties[0].parcel?.evaluations).toHaveLength(1);
      expect(apiProject.properties[0].parcel?.evaluations[0].value).toBe(200);
      expect(apiProject.properties[0].parcel?.evaluations[0].key).toBe(EvaluationKeys.Assessed);
    });

    it('adds an improvement evaluation to a parcel when assessedBuilding is populated', () => {
      const flatProject = {
        ...mockFlatProject,
        properties: [
          {
            ...mockFlatProject.properties[0],
            propertyTypeId: PropertyTypes.PARCEL,
            assessedLand: '',
            assessedBuilding: 200,
          },
        ],
      };
      const apiProject = toApiProject(flatProject as any);
      expect(apiProject.properties[0].parcel?.evaluations).toHaveLength(1);
      expect(apiProject.properties[0].parcel?.evaluations[0].value).toBe(200);
      expect(apiProject.properties[0].parcel?.evaluations[0].key).toBe(EvaluationKeys.Improvements);
    });
    it('adds a fiscal to a parcel when market is populated', () => {
      const flatProject = {
        ...mockFlatProject,
        properties: [
          {
            ...mockFlatProject.properties[0],
            propertyTypeId: PropertyTypes.PARCEL,
            assessedLand: '',
            assessedBuilding: '',
            market: 200,
            netBook: '',
          },
        ],
      };
      const apiProject = toApiProject(flatProject as any);
      expect(apiProject.properties[0].parcel?.fiscals).toHaveLength(1);
      expect(apiProject.properties[0].parcel?.fiscals[0].value).toBe(200);
      expect(apiProject.properties[0].parcel?.fiscals[0].key).toBe(FiscalKeys.Market);
    });
    it('adds a fiscal to a parcel when netBook is populated', () => {
      const flatProject = {
        ...mockFlatProject,
        properties: [
          {
            ...mockFlatProject.properties[0],
            propertyTypeId: PropertyTypes.PARCEL,
            assessedLand: '',
            assessedBuilding: '',
            netBook: 200,
            market: '',
          },
        ],
      };
      const apiProject = toApiProject(flatProject as any);
      expect(apiProject.properties[0].parcel?.fiscals).toHaveLength(1);
      expect(apiProject.properties[0].parcel?.fiscals[0].value).toBe(200);
      expect(apiProject.properties[0].parcel?.fiscals[0].key).toBe(FiscalKeys.NetBook);
    });
    it('adds an assessed evaluation to a building when assessedBuilding is populated', () => {
      const flatProject = {
        ...mockFlatProject,
        properties: [
          {
            ...mockFlatProject.properties[0],
            propertyTypeId: PropertyTypes.BUILDING,
            assessedLand: '',
            assessedBuilding: 200,
          },
        ],
      };
      const apiProject = toApiProject(flatProject as any);
      expect(apiProject.properties[0].building?.evaluations).toHaveLength(1);
      expect(apiProject.properties[0].building?.evaluations[0].value).toBe(200);
      expect(apiProject.properties[0].building?.evaluations[0].key).toBe(EvaluationKeys.Assessed);
    });
    it('adds a fiscal to a building when market is populated', () => {
      const flatProject = {
        ...mockFlatProject,
        properties: [
          {
            ...mockFlatProject.properties[0],
            propertyTypeId: PropertyTypes.BUILDING,
            assessedLand: '',
            assessedBuilding: '',
            market: 200,
            netBook: '',
          },
        ],
      };
      const apiProject = toApiProject(flatProject as any);
      expect(apiProject.properties[0].building?.fiscals).toHaveLength(1);
      expect(apiProject.properties[0].building?.fiscals[0].value).toBe(200);
      expect(apiProject.properties[0].building?.fiscals[0].key).toBe(FiscalKeys.Market);
    });
    it('adds a fiscal to a building when netBook is populated', () => {
      const flatProject = {
        ...mockFlatProject,
        properties: [
          {
            ...mockFlatProject.properties[0],
            propertyTypeId: PropertyTypes.BUILDING,
            assessedLand: '',
            assessedBuilding: '',
            netBook: 200,
            market: '',
          },
        ],
      };
      const apiProject = toApiProject(flatProject as any);
      expect(apiProject.properties[0].building?.fiscals).toHaveLength(1);
      expect(apiProject.properties[0].building?.fiscals[0].value).toBe(200);
      expect(apiProject.properties[0].building?.fiscals[0].key).toBe(FiscalKeys.NetBook);
    });
  });
});
