import { ILookupCode } from 'actions/lookupActions';
import { SelectOption } from 'components/common/form';

/**
 * Convert an ILookupCode into a SelectOption.
 *
 * @param {ILookupCode} code - The code value to identify this item.
 * @param {(number | string | null)} [defaultId] - The default ID.
 * @returns {SelectOption}
 */
export const mapLookupCode = (
  code: ILookupCode,
  defaultId?: number | string | null,
): SelectOption => ({
  label: code.name,
  value: code.id.toString(),
  selected: code.id === defaultId,
  code: code.code,
  parentId: code.parentId,
});
