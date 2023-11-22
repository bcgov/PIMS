import React from 'react';
import { MaskedInputProps } from 'react-text-mask';

export default function mock(props: MaskedInputProps) {
  const { render, defaultValue, ...otherProps } = props;

  function setRef() {}

  const onChange = () => {};

  const onBlur = () => {};

  return render ? (
    render(setRef, {
      ...otherProps,
      onChange,
      onBlur,
      defaultValue: defaultValue as string | undefined,
    })
  ) : (
    <input
      {...otherProps}
      onChange={onChange}
      onBlur={onBlur}
      defaultValue={defaultValue as string | undefined}
    />
  );
}
