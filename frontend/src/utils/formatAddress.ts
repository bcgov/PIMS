import { IAddressModel } from 'hooks/api';

/**
 * Converts the address model to a string address.
 * @param model An address model object.
 * @returns A string that contains the whole address.
 */
export const formatAddress = (model: IAddressModel) => {
  const line1 = model?.line1;
  const line2 = model?.line2 ? ` ${model.line2}` : '';
  const area = model?.administrativeArea ? `, ${model.administrativeArea}` : '';
  const postal = model?.postal ? `, ${model.postal}` : '';

  return line1 + line2 + area + postal;
};
