import { PropertyType, PropertyTypeName } from 'hooks/api';

export const convertToPropertyType = (propertyType: PropertyTypeName): PropertyType => {
  switch (propertyType) {
    case PropertyTypeName.Building:
      return PropertyType.Building;
    case PropertyTypeName.Subdivision:
      return PropertyType.Subdivision;
    case PropertyTypeName.Land:
    default:
      return PropertyType.Parcel;
  }
};
