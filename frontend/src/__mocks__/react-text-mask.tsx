import React, { ChangeEvent, FocusEvent } from 'react';
import { MaskedInputProps } from 'react-text-mask';

export default function mock(props: MaskedInputProps) {
  const {
    render,
    mask,
    guide,
    placeholderChar,
    keepCharPositions,
    pipe,
    defaultValue,
    ...otherProps
  } = props;

  function setRef() {}

  const onChange = (event: ChangeEvent<HTMLElement>) => {};

  const onBlur = (event: FocusEvent<HTMLElement, Element>) => {};

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
