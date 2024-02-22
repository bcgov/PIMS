import React from 'react';
import { Avatar, Badge, Icon, Color } from '@mui/material';
import BuildingIcon from '@/assets/icons/building.svg';
import ParcelIcon from '@/assets/icons/parcel.svg';

type IconType = 'building' | 'parcel';

interface IClassificationIcon {
  indicatorColor: Color;
  amount?: number;
  iconType: IconType;
}

const ClassificationIcon = (props: IClassificationIcon) => {
  const { indicatorColor, amount, iconType } = props;
  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant="dot"
      color={indicatorColor}
    >
      <Avatar style={{ backgroundColor: '#eee' }}>
        <Icon>
          <img height={18} width={18} src={iconType === 'building' ? BuildingIcon : ParcelIcon} />
        </Icon>
      </Avatar>
    </Badge>
  );
};

export default ClassificationIcon;
