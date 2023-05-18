import styled from 'styled-components';

import { IColProps } from '../Col';

export const Col = styled.div<IColProps>`
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  ${(props) => props.flex && `flex: ${props.flex};`}
  ${(props) => props.grow && `flex-grow: ${props.grow};`}
  ${(props) => props.shrink && `flex-shrink: ${props.shrink};`}
  row-gap: ${(props) => props.rowGap ?? '0.5em'};
  ${(props) => props.align && `align-items: ${props.align};`}
`;
