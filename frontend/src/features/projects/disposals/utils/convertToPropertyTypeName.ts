import { PropertyType, PropertyTypeName } from 'hooks/api';

export const convertToPropertyTypeName = (propertyType: PropertyType): PropertyTypeName => {
  switch (propertyType) {
    case PropertyType.Building:
    case PropertyType.DraftBuilding:
      return PropertyTypeName.Building;
    case PropertyType.Subdivision:
      return PropertyTypeName.Subdivision;
    case PropertyType.Parcel:
    case PropertyType.DraftParcel:
    default:
      return PropertyTypeName.Land;
  }
};
