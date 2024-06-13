import { Equal, FindOptionsWhere, ILike } from 'typeorm';

export const ConstructFindOptionFromQuery = <T>(
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
      internalMatcher = ILikeWrapper;
      break;
    default:
      internalMatcher = Equal;
  }
  return { [column]: internalMatcher(value) } as FindOptionsWhere<T>;
};

export const ILikeWrapper = (query: string | undefined) => {
  if (query == undefined) {
    return undefined;
  } else {
    return ILike(`%${query}%`);
  }
};
