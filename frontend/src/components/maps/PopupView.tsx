import * as React from 'react';
import { IBuilding, IParcel, PropertyTypes } from 'actions/parcelsActions';
import { ParcelPopupView } from './ParcelPopupView';
import { BuildingPopupView } from './BuildingPopupView';

export type IPopupViewProps = {
  propertyTypeId: PropertyTypes; // 0 = Parcel, 1 = Building
  propertyDetail: IParcel | IBuilding | null;
  disabled?: boolean;
};

export const PopupView: React.FC<IPopupViewProps> = ({
  propertyTypeId,
  propertyDetail,
  disabled,
}) => {
  if (propertyTypeId === PropertyTypes.PARCEL) {
    return <ParcelPopupView disabled={disabled} parcel={propertyDetail as IParcel} />;
  }
  if (propertyTypeId === PropertyTypes.BUILDING) {
    return <BuildingPopupView building={propertyDetail as IBuilding} />;
  }
  if (propertyTypeId === PropertyTypes.DRAFT_PARCEL) {
    return <p>This is a draft marker for parcel: {propertyDetail?.name ?? 'New Parcel'}</p>;
  }
  if (propertyTypeId === PropertyTypes.DRAFT_BUILDING) {
    return <p>This is a draft marker for building: {propertyDetail?.name ?? 'New Building'}</p>;
  }
  return null;
};
