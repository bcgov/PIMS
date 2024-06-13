import { Grid } from '@mui/material';
import React, { PropsWithChildren } from 'react';

const typographyStyle = (theme) => ({ ...theme.typography.body2 });
export const LeftGridColumn = (props: PropsWithChildren & { alignment?: string }) => (
  <Grid
    item
    xs={4}
    typography={typographyStyle}
    sx={{
      fontWeight: 'bold',
      display: 'flex',
      alignItems: props.alignment ?? 'center',
    }}
  >
    {props.children}
  </Grid>
);
export const RightGridColumn = (props: PropsWithChildren & { alignment?: string }) => (
  <Grid
    item
    xs={7}
    typography={typographyStyle}
    sx={{
      display: 'flex',
      alignItems: props.alignment ?? 'center',
    }}
  >
    {props.children ?? ''}
  </Grid>
);

export interface GridColumnPairProps {
  leftValue: any;
  rightValue: any;
  alignment?: string;
}

/**
 * Renders a pair of grid columns with a left value and a right value.
 *
 * @param {GridColumnPairProps} props - The props for the GridColumnPair component.
 * @param {any} props.leftValue - The value to be displayed in the left column.
 * @param {any} props.rightValue - The value to be displayed in the right column.
 * @param {string} [props.alignment] - The alignment of the columns. Defaults to 'center'.
 * @returns {JSX.Element} The rendered GridColumnPair component.
 */
export const GridColumnPair = (props: GridColumnPairProps) => {
  return (
    <>
      <LeftGridColumn alignment={props.alignment}>{props.leftValue}</LeftGridColumn>
      <RightGridColumn alignment={props.alignment}>{props.rightValue}</RightGridColumn>
    </>
  );
};
