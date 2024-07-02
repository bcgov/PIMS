import { Grid, Typography } from '@mui/material';
import React, { PropsWithChildren } from 'react';

const typographyStyle = (theme) => ({ ...theme.typography.body2 });
interface GridColumnProps extends PropsWithChildren {
  alignment?: string;
  size?: number;
}
export const LeftGridColumn = (props: GridColumnProps) => (
  <Grid
    item
    xs={props.size ?? 4}
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
export const RightGridColumn = (props: GridColumnProps) => (
  <Grid
    item
    xs={props.size ?? 7}
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
  leftSize?: number;
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
  const rightSize = props.leftSize ? 12 - props.leftSize : undefined;
  return (
    <>
      <LeftGridColumn alignment={props.alignment} size={props.leftSize}>
        {props.leftValue}
      </LeftGridColumn>
      <RightGridColumn alignment={props.alignment} size={rightSize}>
        {props.rightValue}
      </RightGridColumn>
    </>
  );
};

export const GridSubtitle = (props: PropsWithChildren) => (
  <>
    <Grid item xs={12}>
      <Typography
        variant="h4"
        sx={{
          margin: 0,
        }}
      >
        {props.children}
      </Typography>
    </Grid>
    <Grid item xs={12} sx={{ borderTop: 'solid 1px gray' }} />
  </>
);
