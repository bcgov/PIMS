import * as React from 'react';
import { IBuilding, IParcel, IProperty, PropertyTypes } from 'actions/parcelsActions';
import { ParcelPopupView } from './ParcelPopupView';
import { BuildingPopupView } from './BuildingPopupView';
import { useApi } from 'hooks/useApi';

export type IPopupViewProps = {
  /** The property selected */
  propertyDetail: IParcel | IBuilding | null;
  /** Zoom level that the map should zoom to. */
  zoomTo?: () => void;
  /** Whether the Popup action menu is disabled. */
  disabled?: boolean;
  /** Event is fired when a link on the popup is clicked. */
  onLinkClick?: () => void;
};

/**
 * Displays a popup that describes the selected property.
 * Makes an ajax request to fetch the property information.
 * @param param0 PopupView properties.
 */
export const PopupView: React.FC<IPopupViewProps> = ({
  propertyDetail,
  disabled,
  zoomTo,
  onLinkClick,
}) => {
  const { getParcel, getBuilding } = useApi();
  const [property, setProperty] = React.useState<IProperty | null>(propertyDetail);
  const id = propertyDetail?.id;
  const agencyId = propertyDetail?.agencyId;
  const propertyTypeId = propertyDetail?.propertyTypeId;

  React.useEffect(() => {
    if ((agencyId as number) > 0) {
      if (propertyTypeId === PropertyTypes.PARCEL) {
        getParcel(id as number).then(parcel => {
          setProperty(parcel);
        });
      } else if (propertyTypeId === PropertyTypes.BUILDING) {
        getBuilding(id as number).then(building => {
          setProperty(building);
        });
      }
    }
  }, [getParcel, getBuilding, agencyId, propertyTypeId, id]);

  if (propertyDetail && propertyTypeId === PropertyTypes.PARCEL) {
    return (
      <ParcelPopupView
        zoomTo={zoomTo}
        disabled={disabled}
        parcel={property as IParcel}
        onLinkClick={onLinkClick}
      />
    );
  }
  if (propertyDetail && propertyTypeId === PropertyTypes.BUILDING) {
    return (
      <BuildingPopupView
        zoomTo={zoomTo}
        building={property as IBuilding}
        onLinkClick={onLinkClick}
      />
    );
  }
  if (propertyTypeId === PropertyTypes.DRAFT_PARCEL) {
    return <p>This is a draft marker for parcel: {propertyDetail?.name ?? 'New Parcel'}</p>;
  }
  if (propertyTypeId === PropertyTypes.DRAFT_BUILDING) {
    return <p>This is a draft marker for building: {propertyDetail?.name ?? 'New Building'}</p>;
  }
  return <></>;
};
