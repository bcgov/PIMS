import { EvaluationKeyName, IEvaluationModel } from 'hooks/api';

/**
 * Get the most recent evaluation.
 * @param evaluations An array of evaluations for the property.
 * @param key The type of evaluation to search for.
 */
export const getMostRecentEvaluation = (
  evaluations: IEvaluationModel[],
  key: EvaluationKeyName,
): IEvaluationModel | undefined => {
  const result = evaluations
    .filter((f) => f.key === key)
    .sort((a, b) => {
      if (a.date < b.date) return 1;
      if (a.date > b.date) return -1;
      return 0;
    });

  return result?.length ? result[0] : undefined;
};
