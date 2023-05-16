import styled from 'styled-components';

import { IRowProps } from '../Row';

export const Row = styled.div<IRowProps>`
  display: ${(props) => props.display ?? 'flex'};
  flex-direction: row;
  flex-wrap: ${(props) => (props.nowrap ? 'nowrap' : 'wrap')};
  align-items: ${(props) => props.align ?? 'stretch'};
  column-gap: ${(props) => props.columnGap ?? '0.5em'};
  row-gap: ${(props) => props.rowGap ?? '0.5em'};
  flex-grow: ${(props) => props.grow ?? 1};
  flex-shrink: ${(props) => props.shrink ?? 1};
`;
