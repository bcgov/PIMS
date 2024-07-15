import { Equal, FindOptionsWhere, IsNull, Not, Raw } from 'typeorm';

/**
 * Special case for PID/PIN matching, as general text comparison is not sufficient.
 * We need to pad the results of the SELECT with LPAD() so that you can, for example,
 * query '000244' and have that match against PID 000-244-299, which is stored as the integer 244299.
 * Doing "...WHERE pid::text ILIKE '%000244%'; " fails, but doing "... WHERE LPAD(pid::text, 9, '0') ILIKE '%000244%'; " succeeds.
 * @param column
 * @param operatorValuePair
 * @returns
 */
export const constructFindOptionFromQueryPid = <T>(
  column: keyof T,
  operatorValuePair: string,
): FindOptionsWhere<T> => {
  if (operatorValuePair == null || operatorValuePair.match(/([^,]*),(.*)/) == null)
    return { [column]: undefined } as FindOptionsWhere<T>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, operator, value] = operatorValuePair.match(/([^,]*),(.*)/).map((a) => a.trim());
  const trimmedValue = value.replace(/[^\d]/g, ''); //remove all non digit characters;
  let internalMatcher;
  switch (operator) {
    case 'equals':
      internalMatcher = Equal;
      break;
    case 'contains':
      internalMatcher = (str: string) =>
        Raw((alias) => `LPAD( (${alias})::TEXT, 9, '0') ILIKE '%${str}%'`);
      break;
    case 'startsWith':
      internalMatcher = (str: string) =>
        Raw((alias) => `LPAD( (${alias})::TEXT, 9, '0') ILIKE '${str}%'`);
      break;
    case 'endsWith':
      internalMatcher = (str: string) =>
        Raw((alias) => `LPAD( (${alias})::TEXT, 9, '0') ILIKE '%${str}'`);
      break;
    default:
      return constructFindOptionFromQuery(column, operatorValuePair);
  }
  return { [column]: internalMatcher(trimmedValue) } as FindOptionsWhere<T>;
};

export const constructFindOptionFromQueryBoolean = <T>(
  column: keyof T,
  operatorValuePair: string, //format: "operator,value"
): FindOptionsWhere<T> => {
  if (operatorValuePair == null || operatorValuePair.match(/([^,]*),(.*)/) == null)
    return { [column]: undefined } as FindOptionsWhere<T>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, operator, value] = operatorValuePair.match(/([^,]*),(.*)/).map((a) => a.trim());
  let internalMatcher;
  // Empty string for when table searches for 'any'
  if (value === '') return { [column]: undefined } as FindOptionsWhere<T>;
  switch (operator) {
    case 'is':
      internalMatcher = (str: string) => Raw((alias) => `${alias} = ${str.toUpperCase()}`);
      break;
    case 'not':
      internalMatcher = (str: string) => Raw((alias) => `${alias} != ${str.toUpperCase()}`);
      break;
    default:
      return { [column]: undefined } as FindOptionsWhere<T>;
  }
  return { [column]: internalMatcher(value) } as FindOptionsWhere<T>;
};

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
  if (operatorValuePair == null || operatorValuePair.match(/([^,]*),(.*)/) == null)
    return { [column]: undefined } as FindOptionsWhere<T>;
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
    return Raw((alias) => `(${alias})::TEXT ILIKE '${searchText}'`);
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
  if (operator === '=') {
    return Raw((alias) => `(${alias})::DATE = '${toPostgresTimestamp(new Date(tsValue))}'::DATE`);
  } else if (operator === '!=') {
    return Raw((alias) => `(${alias})::DATE != '${toPostgresTimestamp(new Date(tsValue))}'::DATE`);
  }
  return Raw((alias) => `${alias} ${operator} '${toPostgresTimestamp(new Date(tsValue))}'`);
};

//The behavior of the Raw function seems bugged under certain query formats.
//It will use the correct table alias name, but not the correct column.
//ie. It will pass Project.ProjectNumber instead of "Project_project_number" (correct column alias constructed by TypeORM)
//or "Project".project_number (correct table alias plus non-aliased column access)
//Thankfully, it's not too difficult to manually format this.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const fixColumnAlias = (str: string) => {
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
export const toPostgresTimestamp = (date: Date) => {
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
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
