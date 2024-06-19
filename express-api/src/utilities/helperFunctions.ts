import { Equal, FindOptionsWhere, IsNull, Not, Raw } from 'typeorm';

/**
 * Accepts a column alias and produces a FindOptionsWhere style object.
 * This lets you plug in the return value to typeorm functions such as .find, findOne, etc.
 * @param column column name, should be a key of the TypeORM entity
 * @param operatorValuePair should be in the format of "operator,value", where operator is one of the supported statements below
 * @returns FindOptionsWhere<T>
 */
export const constructFindOptionFromQuery = <T>(
  column: keyof T,
  operatorValuePair: string, //format: "operator,value"
): FindOptionsWhere<T> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, operator, value] = operatorValuePair.match(/([^,]*),(.*)/).map((a) => a.trim());
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
/**
 * Returns a FindOptionsWhere type object formatted to provide common ILIKE style matching.
 * The column will be automatically cast to Postgres text type for maximum compatibility.
 * Ex: { Name: ILikeWrapper('foo') } will produce SQL like "... WHERE name::text ILIKE '%foo%' "
 * @param query string to match against
 * @param mode contains | startsWith | endsWith, determines wildcard char position
 * @returns FindOperatorWhere<T>
 */
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
/**
 * Simple wrapper that takes a JS style date string and yields a postgres time comparison.
 * @param tsValue JS Style date string
 * @param operator '=' | '!=' | '<=' | '>=' | '<' | '>'
 * @returns FindOptionsWhere<T>
 */
export const TimestampComparisonWrapper = (tsValue: string, operator: TimestampOperator) => {
  return Raw((alias) => `${alias} ${operator} '${toPostgresTimestamp(new Date(tsValue))}'`);
};

//The behavior of the Raw function seems bugged under certain query formats.
//It will use the correct table alias name, but not the correct column.
//ie. It will pass Project.ProjectNumber instead of "Project_project_number" (correct column alias constructed by TypeORM)
//or "Project".project_number (correct table alias plus non-aliased column access)
//Thankfully, it's not too difficult to manually format this.
const fixColumnAlias = (str: string) => {
  const [tableAlias, columnAlias] = str.split('.');
  const fixedColumn = columnAlias
    .split(/\.?(?=[A-Z])/)
    .join('_')
    .toLowerCase(); // ExamplePascalCase -> example_pascal_case
  return `"${tableAlias}".${fixedColumn}`;
};

/**
 * Converstion of JS Date object type to the equivalent Postgres timestamp format string.
 * @param date JS Date object
 * @returns string
 */
const toPostgresTimestamp = (date: Date) => {
  console.log(`date obj in: ${date.toUTCString()}`);
  const pad = (num: number, size = 2) => {
    let s = String(num);
    while (s.length < size) s = '0' + s;
    return s;
  };

  const year = date.getFullYear();
  const month = pad(date.getUTCMonth() + 1); // getMonth() is zero-based
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  console.log(`date obj out: ${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
