export enum PropertyTypes {
  LAND = 0,
  BUILDING = 1,
  SUBDIVISION = 2,
}

export const propertyTypeMapper = (id: number) => {
  switch (id){
    case 0:
      return 'Land';
    case 1:
      return 'Building';
    case 2:
      return 'Subdivision';
    default:
      return '';
  }
}
