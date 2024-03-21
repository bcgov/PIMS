import { Box, Radio, Icon, Typography, useTheme, SxProps } from '@mui/material';
import React from 'react';

type BoxedIconRadioProps = {
  onClick: React.MouseEventHandler<HTMLDivElement>;
  checked: boolean;
  value: string;
  icon: string;
  mainText: string;
  subText?: string;
  iconScale?: number;
  boxSx?: SxProps;
};

const BoxedIconRadio = (props: BoxedIconRadioProps) => {
  const { onClick, checked, value, icon, mainText, subText, iconScale, boxSx } = props;
  const theme = useTheme();
  return (
    <Box
      borderRadius={'4px'}
      padding={'1.2rem'}
      display={'flex'}
      alignItems={'center'}
      flexDirection={'row'}
      gap={'1.5rem'}
      onClick={onClick}
      sx={{
        '&:hover': {
          cursor: 'pointer',
        },
        borderStyle: 'solid',
        borderColor: checked ? theme.palette.primary.main : 'rgba(0, 0, 0, 0.23)',
        borderWidth: '1px',
        ...boxSx,
      }}
    >
      <Radio checked={checked} value={value} sx={{ padding: 0 }} />
      <Icon>
        <img height={18 * (iconScale ?? 1)} width={18 * (iconScale ?? 1)} src={icon} />
      </Icon>
      <Box>
        <Typography>{mainText}</Typography>
        <Typography color={'rgba(0, 0, 0, 0.5)'}>{subText}</Typography>
      </Box>
    </Box>
  );
};

export default BoxedIconRadio;
