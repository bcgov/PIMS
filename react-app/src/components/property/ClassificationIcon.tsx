import React from 'react';
import { Avatar, Badge, Box, Icon, Typography } from '@mui/material';
import BuildingIcon from '@/assets/icons/building.svg';
import ParcelIcon from '@/assets/icons/parcel.svg';

type IconType = 'building' | 'parcel';

type ClassificationIconType = {
  amount?: number;
  iconType: IconType;
  textColor: string;
  backgroundColor: string;
  scale?: number;
};

export const ClassificationIcon = (props: ClassificationIconType) => {
  const { amount, iconType, textColor, backgroundColor, scale } = props;
  const internalScale = scale ?? 1;
  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={amount ?? 0}
      sx={{
        '& .MuiBadge-badge': {
          color: textColor,
          backgroundColor: backgroundColor,
        },
        width: 32 * internalScale,
        height: 32 * internalScale,
      }}
    >
      <Avatar
        style={{ backgroundColor: '#eee', height: 32 * internalScale, width: 32 * internalScale }}
      >
        <Icon>
          <img
            height={18 * internalScale}
            width={18 * internalScale}
            src={iconType === 'building' ? BuildingIcon : ParcelIcon}
          />
        </Icon>
      </Avatar>
    </Badge>
  );
};

interface IClassificationInline {
  color: string;
  backgroundColor: string;
  title: string;
}

export const ClassificationInline = (props: IClassificationInline) => {
  return (
    <Box display={'inline-flex'} flexDirection={'row'} alignItems={'center'} gap={'12px'}>
      <Box
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        sx={{
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          backgroundColor: props.backgroundColor,
        }}
      >
        <Box
          sx={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            opacity: '100%',
            backgroundColor: props.color,
          }}
        ></Box>
      </Box>
      <Typography fontSize={'0.8rem'}>{props.title}</Typography>
    </Box>
  );
};
