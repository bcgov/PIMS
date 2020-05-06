import React from 'react';
import { MaskedInputProps } from 'react-text-mask';
/**
 * see https://github.com/text-mask/text-mask/issues/427
 */
export default function mock(props: MaskedInputProps) {
  const { render, mask, ...otherProps } = props;

  function setRef() {}

  return props.render ? props.render(setRef, { ...otherProps }) : <input {...otherProps} />;
}
