import { Equal, FindOptionsWhere, IsNull, Not, Raw } from 'typeorm';

export const constructFindOptionFromQuery = <T>(
  column: keyof T,
  operatorValuePair: string, //format: "operator,value"
): FindOptionsWhere<T> => {
  const [operator, value] = operatorValuePair.split(',').map((a) => a.trim());
  let internalMatcher;
  switch (operator) {
    case 'equals':
      internalMatcher = Equal;
      break;
    case 'contains':
      internalMatcher = (str: string) => ILikeWrapper(str, 'contains');
      break;
    case 'startsWith':
      internalMatcher = (str: string) => ILikeWrapper(str, 'startsWith');
      break;
    case 'endsWith':
      internalMatcher = (str: string) => ILikeWrapper(str, 'endsWith');
      break;
    case 'is':
      internalMatcher = (str: string) => TimestampComparisonWrapper(str, '=');
      break;
    case 'not':
      internalMatcher = (str: string) => TimestampComparisonWrapper(str, '!=');
      break;
    case 'after':
      internalMatcher = (str: string) => TimestampComparisonWrapper(str, '>');
      break;
    case 'before':
      internalMatcher = (str: string) => TimestampComparisonWrapper(str, '<');
      break;
    case 'onOrAfter':
      internalMatcher = (str: string) => TimestampComparisonWrapper(str, '>=');
      break;
    case 'onOrBefore':
      internalMatcher = (str: string) => TimestampComparisonWrapper(str, '<=');
      break;
    case 'isNotEmpty':
      internalMatcher = () => Not(IsNull());
      break;
    case 'isEmpty':
      internalMatcher = IsNull;
      break;
    default:
      return { [column]: undefined } as FindOptionsWhere<T>;
  }
  return { [column]: internalMatcher(value) } as FindOptionsWhere<T>;
};

type ILikeWrapperMode = 'contains' | 'startsWith' | 'endsWith';
export const ILikeWrapper = (query: string | undefined, mode: ILikeWrapperMode = 'contains') => {
  if (query == undefined) {
    return undefined;
  } else {
    let searchText = '';
    if (mode === 'startsWith') {
      searchText = `${query}%`;
    } else if (mode === 'endsWith') {
      searchText = `%${query}`;
    } else {
      searchText = `%${query}%`;
    }
    return Raw((alias) => `${fixColumnAlias(alias)}::text ILIKE '${searchText}'`);
  }
};

type TimestampOperator = '=' | '!=' | '<=' | '>=' | '<' | '>';
export const TimestampComparisonWrapper = (tsValue: string, operator: TimestampOperator) => {
  return Raw((alias) => `${alias} ${operator} '${toPostgresTimestamp(new Date(tsValue))}'`);
};

const fixColumnAlias = (str: string) => {
  const [tableAlias, columnAlias] = str.split('.');
  const fixedColumn = columnAlias
    .split(/\.?(?=[A-Z])/)
    .join('_')
    .toLowerCase();
  return `"${tableAlias}".${fixedColumn}`;
};

const toPostgresTimestamp = (date: Date) => {
  const pad = (num: number, size = 2) => {
    let s = String(num);
    while (s.length < size) s = '0' + s;
    return s;
  };

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // getMonth() is zero-based
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
