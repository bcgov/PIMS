import { FiscalKeyName, IFiscalModel } from 'hooks/api';

/**
 * Get the most recent fiscal.
 * @param fiscals An array of fiscals for the property.
 * @param key The type of fiscal to search for.
 */
export const getMostRecentFiscal = (
  fiscals: IFiscalModel[],
  key: FiscalKeyName,
): IFiscalModel | undefined => {
  const result = fiscals
    .filter((f) => f.key === key)
    .sort((a, b) => {
      if (a.fiscalYear < b.fiscalYear) return 1;
      if (a.fiscalYear > b.fiscalYear) return -1;
      return 0;
    });

  return result.length ? result[0] : undefined;
};
