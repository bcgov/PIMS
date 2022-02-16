import { MaskedInputProps } from 'components/text-mask';
import React from 'react';
/**
 * see https://github.com/text-mask/text-mask/issues/427
 */
export default function mock(props: MaskedInputProps) {
  const { render, mask, ...otherProps } = props;

  function setRef() {}

  return props.render ? props.render(setRef, { ...otherProps }) : <input {...otherProps} />;
}
