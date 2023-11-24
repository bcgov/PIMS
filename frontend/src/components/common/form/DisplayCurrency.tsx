import './DisplayCurrency.scss';

import React from 'react';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'utils/createNumberMask';

import { defaultMaskOptions } from './FastCurrencyInput';

type RequiredAttributes = {
  /** The value to display */
  value?: number | '';
};
/**
 * To provide a read only currency format used in tables, commonly for displaying sums.
 * @param param0
 */
export const DisplayCurrency = ({ value }: RequiredAttributes) => {
  const currencyMask = createNumberMask({
    ...defaultMaskOptions,
  });
  return (
    <MaskedInput
      className="displayCurrency"
      value={value}
      mask={currencyMask}
      disabled={true}
      placeholder="$0"
    />
  );
};
