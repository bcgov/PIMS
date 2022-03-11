import React from 'react';

import * as styled from './styled';

export interface IRowProps extends React.HTMLAttributes<HTMLDivElement> {
  columnGap?: number | string;
  rowGap?: number | string;
  nowrap?: boolean;
  grow?: number | string;
  shrink?: number | string;
  display?: 'flex' | 'flex-grid';
  align?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
}

export const Row: React.FC<IRowProps> = ({ children, ...rest }) => {
  return <styled.Row {...rest}>{children}</styled.Row>;
};
