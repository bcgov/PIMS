import {
  constructFindOptionFromQuery,
  constructFindOptionFromQueryPid,
  fixColumnAlias,
  ILikeWrapper,
  TimestampComparisonWrapper,
  toPostgresTimestamp,
} from '@/utilities/helperFunctions';
import { EqualOperator, FindOperator } from 'typeorm';

describe('UNIT - helperFunctions', () => {
  describe('toPostgresTimestamp', () => {
    it('should return the reformatted timestamp', () => {
      const date = new Date('2024-07-09');
      const result = toPostgresTimestamp(date);
      expect(result).toBe('2024-07-09 00:00:00');
    });
  });

  describe('fixColumnAlias', () => {
    it('should return a fixed column alias e.g. table.fixed_column', () => {
      const tableColumnPair = 'user.FirstName';
      const result = fixColumnAlias(tableColumnPair);
      expect(result).toBe('"user".first_name');
    });
  });

  describe('TimestampComparisonWrapper', () => {
    it('should return an equals query', () => {
      const result = TimestampComparisonWrapper(new Date('2024-07-09').toUTCString(), '=');
      expect(result).toBeInstanceOf(FindOperator);
      expect(result.getSql('date')).toBe(`(date)::DATE = '2024-07-09 00:00:00'::DATE`);
    });
    it('should return a not equals query', () => {
      const result = TimestampComparisonWrapper(new Date('2024-07-09').toUTCString(), '!=');
      expect(result).toBeInstanceOf(FindOperator);
      expect(result.getSql('date')).toBe(`(date)::DATE != '2024-07-09 00:00:00'::DATE`);
    });
    it('should return other query comparisons', () => {
      const result = TimestampComparisonWrapper(new Date('2024-07-09').toUTCString(), '>=');
      expect(result).toBeInstanceOf(FindOperator);
      expect(result.getSql('date')).toBe(`date >= '2024-07-09 00:00:00'`);
    });
  });

  describe('ILikeWrapper', () => {
    it('should return undefined when the query is undefined', () => {
      expect(ILikeWrapper(undefined)).toBeUndefined();
    });

    it('should return _____% in query when the mode is startsWith', () => {
      const result = ILikeWrapper('test', 'startsWith');
      expect(result.getSql('query')).toBe(`(query)::TEXT ILIKE 'test%'`);
    });

    it('should return %_____ in query when the mode is endsWith', () => {
      const result = ILikeWrapper('test', 'endsWith');
      expect(result.getSql('query')).toBe(`(query)::TEXT ILIKE '%test'`);
    });

    it('should return %_____% in query when the mode is contains or undefined', () => {
      let result = ILikeWrapper('test', 'contains');
      expect(result.getSql('query')).toBe(`(query)::TEXT ILIKE '%test%'`);
      result = ILikeWrapper('test');
      expect(result.getSql('query')).toBe(`(query)::TEXT ILIKE '%test%'`);
    });
  });

  describe('constructFindOptionFromQuery', () => {
    it('should return undefined when the pair is null-ish', () => {
      const result = constructFindOptionFromQuery('test', undefined);
      expect(result.test).toBeUndefined();
    });

    it('should produce and equal operator when operator is "equals', () => {
      const result = constructFindOptionFromQuery('test', 'equals,query');
      expect(result.test).toBeInstanceOf(EqualOperator);
    });

    it('should produce %____% query when operator is "contains"', () => {
      const result = constructFindOptionFromQuery('test', 'contains,query');
      expect(result.test.getSql('query')).toBe(`(query)::TEXT ILIKE '%query%'`);
    });
    it('should produce ____% query when operator is "startsWith"', () => {
      const result = constructFindOptionFromQuery('test', 'startsWith,query');
      expect(result.test.getSql('query')).toBe(`(query)::TEXT ILIKE 'query%'`);
    });
    it('should produce %____ query when operator is "endsWith"', () => {
      const result = constructFindOptionFromQuery('test', 'endsWith,query');
      expect(result.test.getSql('query')).toBe(`(query)::TEXT ILIKE '%query'`);
    });

    it('should produce = DATE query when operator is "is"', () => {
      const result = constructFindOptionFromQuery(
        'test',
        `is,${new Date('2024-07-09').toUTCString()}`,
      );
      expect(result.test.getSql('query')).toBe(`(query)::DATE = '2024-07-09 00:00:00'::DATE`);
    });

    it('should produce != DATE query when operator is "not"', () => {
      const result = constructFindOptionFromQuery(
        'test',
        `not,${new Date('2024-07-09').toUTCString()}`,
      );
      expect(result.test.getSql('query')).toBe(`(query)::DATE != '2024-07-09 00:00:00'::DATE`);
    });

    it('should produce > DATE query when operator is "after"', () => {
      const result = constructFindOptionFromQuery(
        'test',
        `after,${new Date('2024-07-09').toUTCString()}`,
      );
      expect(result.test.getSql('query')).toBe(`query > '2024-07-09 00:00:00'`);
    });

    it('should produce < DATE query when operator is "before"', () => {
      const result = constructFindOptionFromQuery(
        'test',
        `before,${new Date('2024-07-09').toUTCString()}`,
      );
      expect(result.test.getSql('query')).toBe(`query < '2024-07-09 00:00:00'`);
    });

    it('should produce >= DATE query when operator is "onOrAfter"', () => {
      const result = constructFindOptionFromQuery(
        'test',
        `onOrAfter,${new Date('2024-07-09').toUTCString()}`,
      );
      expect(result.test.getSql('query')).toBe(`query >= '2024-07-09 00:00:00'`);
    });

    it('should produce <= DATE query when operator is "onOrBefore"', () => {
      const result = constructFindOptionFromQuery(
        'test',
        `onOrBefore,${new Date('2024-07-09').toUTCString()}`,
      );
      expect(result.test.getSql('query')).toBe(`query <= '2024-07-09 00:00:00'`);
    });

    it('should produce NOT NULL query when operator is "isNotEmpty"', () => {
      const result = constructFindOptionFromQuery('test', `isNotEmpty,`);
      expect(result.test?.type).toBe('not');
    });

    it('should produce NULL query when operator is "isEmpty"', () => {
      const result = constructFindOptionFromQuery('test', `isEmpty,`);
      expect(result.test?.type).toBe('isNull');
    });

    it('should produce undefined query when operator is an unexpected string', () => {
      const result = constructFindOptionFromQuery('test', `wow,`);
      expect(result.test).toBeUndefined();
    });
  });

  describe('constructFindOptionFromQueryPid', () => {
    it('should return "equals" query when the operator is "equals', () => {
      const result = constructFindOptionFromQueryPid('test', 'equals,3');
      expect(result.test).toBeInstanceOf(EqualOperator);
    });

    it('should return %____% query when the operator is "contains', () => {
      const result = constructFindOptionFromQueryPid('test', 'contains,3');
      expect(result.test.getSql('query')).toBe(`LPAD( (query)::TEXT, 9, '0') ILIKE '%3%'`);
    });

    it('should return ____% query when the operator is "startsWith', () => {
      const result = constructFindOptionFromQueryPid('test', 'startsWith,3');
      expect(result.test.getSql('query')).toBe(`LPAD( (query)::TEXT, 9, '0') ILIKE '3%'`);
    });

    it('should return %____ query when the operator is "endsWith', () => {
      const result = constructFindOptionFromQueryPid('test', 'endsWith,3');
      expect(result.test.getSql('query')).toBe(`LPAD( (query)::TEXT, 9, '0') ILIKE '%3'`);
    });

    it('should return the default response from constructFindOptionQuery if the operator does not match', () => {
      const result = constructFindOptionFromQueryPid('test', 'wow,3');
      expect(result.test).toBeUndefined();
    });
  });
});
