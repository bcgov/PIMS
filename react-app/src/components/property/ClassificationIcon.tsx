import React from 'react';
import { Avatar, Badge, Box, Icon, Typography } from '@mui/material';
import BuildingIcon from '@/assets/icons/building.svg';
import ParcelIcon from '@/assets/icons/parcel.svg';

type IconType = 'building' | 'parcel';

type ClassificationIconType = {
  amount?: number;
  iconType: IconType;
  textColor?: string;
  badgeColor?: string;
  scale?: number;
  badgeScale?: number;
  showBadge?: boolean;
};

export const ClassificationIcon = (props: ClassificationIconType) => {
  const {
    amount,
    badgeScale,
    iconType,
    textColor,
    badgeColor,
    scale = 1,
    showBadge = true,
  } = props;
  const badgeContent = amount != null ? amount : '';
  return (
    <Box
      sx={{
        transform: `scale(${scale})`,
      }}
    >
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={badgeContent}
        invisible={!showBadge}
        showZero
        sx={{
          '& .MuiBadge-badge': {
            padding: '0.5em',
            color: textColor,
            backgroundColor: badgeColor,
            fontSize: Math.max(4 * (badgeScale ?? scale), 6),
            minHeight: '5px',
            minWidth: '5px',
            height: 10 * (badgeScale ?? scale),
            width: 10 * (badgeScale ?? scale),
            borderRadius: '100%',
          },
        }}
      >
        <Avatar style={{ backgroundColor: '#eee', height: 40, width: 40 }}>
          <Icon>
            <img height={22} width={22} src={iconType === 'building' ? BuildingIcon : ParcelIcon} />
          </Icon>
        </Avatar>
      </Badge>
    </Box>
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
