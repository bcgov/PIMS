import { noop } from 'lodash';
import React from 'react';
import { IParcel, IBuilding } from 'actions/parcelsActions';

interface IPopUpContext {
  propertyInfo: IParcel | IBuilding | null;
  setPropertyInfo: (propertyInfo: IParcel | IBuilding | null) => void;
  propertyTypeID: number | null;
  setPropertyTypeID: (propertyTypeID: number) => void;
}

export const PropertyPopUpContext = React.createContext<IPopUpContext>({
  propertyInfo: null,
  setPropertyInfo: noop,
  propertyTypeID: null,
  setPropertyTypeID: noop,
});

/**
 * Allows for the property information to be sent to the map
 * when the user clicks on a marker
 */
export const PropertyPopUpContextProvider: React.FC = ({ children }) => {
  const [propertyInfo, setPropertyInfo] = React.useState<IParcel | IBuilding | null>(null);
  const [propertyTypeID, setPropertyTypeID] = React.useState<number | null>(null);
  return (
    <PropertyPopUpContext.Provider
      value={{ propertyInfo, setPropertyInfo, propertyTypeID, setPropertyTypeID }}
    >
      {children}
    </PropertyPopUpContext.Provider>
  );
};
