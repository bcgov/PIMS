import * as React from 'react';
import { IBuilding, IParcel } from 'actions/parcelsActions';
import { ParcelPopupView } from './ParcelPopupView';
import { BuildingPopupView } from './BuildingPopupView';

export type IPopupViewProps = {
  propertyTypeId: 0 | 1; // 0 = Parcel, 1 = Building
  propertyDetail: IParcel | IBuilding | null;
  disabled?: boolean;
};

export const PopupView: React.FC<IPopupViewProps> = ({
  propertyTypeId,
  propertyDetail,
  disabled,
}) => {
  if (propertyTypeId === 0) {
    return <ParcelPopupView disabled={disabled} parcel={propertyDetail as IParcel} />;
  }
  if (propertyTypeId === 1) {
    return <BuildingPopupView building={propertyDetail as IBuilding} />;
  }
  return null;
};
