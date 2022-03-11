import React from 'react';

import * as styled from './styled';

export interface IColProps extends React.HTMLAttributes<HTMLDivElement> {
  rowGap?: string;
  grow?: number;
  shrink?: number;
  flex?: string;
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
}

export const Col: React.FC<IColProps> = ({ children, ...rest }) => {
  return <styled.Col {...rest}>{children}</styled.Col>;
};
