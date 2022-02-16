import { IBuilding, IParcel } from 'actions/parcelsActions';
import { noop } from 'lodash';
import React from 'react';

interface IPopUpContext {
  propertyInfo: IParcel | IBuilding | null;
  setPropertyInfo: (propertyInfo: IParcel | IBuilding | null) => void;
  propertyTypeId: number | null;
  setPropertyTypeId: (propertyTypeId: number) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  showBCEIDWarning: boolean;
  setBCEIDWarning: (showBCEIDWarning: boolean) => void;
}

export const PropertyPopUpContext = React.createContext<IPopUpContext>({
  propertyInfo: null,
  setPropertyInfo: noop,
  propertyTypeId: null,
  setPropertyTypeId: noop,
  loading: false,
  setLoading: noop,
  showBCEIDWarning: false,
  setBCEIDWarning: noop,
});

/**
 * Allows for the property information to be sent to the map
 * when the user clicks on a marker
 */
export const PropertyPopUpContextProvider: React.FC = ({ children }) => {
  const [propertyInfo, setPropertyInfo] = React.useState<IParcel | IBuilding | null>(null);
  const [propertyTypeId, setPropertyTypeId] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [showBCEIDWarning, setBCEIDWarning] = React.useState<boolean>(false);
  return (
    <PropertyPopUpContext.Provider
      value={{
        propertyInfo,
        setPropertyInfo,
        propertyTypeId,
        setPropertyTypeId,
        loading,
        setLoading,
        showBCEIDWarning,
        setBCEIDWarning,
      }}
    >
      {children}
    </PropertyPopUpContext.Provider>
  );
};
