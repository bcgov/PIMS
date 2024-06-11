import { ClusterGeo } from "@/components/map/InventoryLayer";
import PropertyRow from "@/components/map/propertyRow/PropertyRow";
import { PropertyTypes } from "@/constants/propertyTypes";
import { PropertyGeo } from "@/hooks/api/usePropertiesApi";
import useDataLoader from "@/hooks/useDataLoader";
import usePimsApi from "@/hooks/usePimsApi";
import { pidFormatter } from "@/utilities/formatters";
import { Box } from "@mui/material";
import React from "react";

interface ClusterPopupProps {
  properties: (PropertyGeo & ClusterGeo)[]
}
 
const ClusterPopup = (props: ClusterPopupProps) => {
  const {properties} = props;
  const api = usePimsApi();
  const { data: agencyData, loadOnce: loadAgencies } = useDataLoader(api.agencies.getAgencies);
  const { data: adminAreaData, loadOnce: loadAdminAreas } = useDataLoader(
    api.administrativeAreas.getAdministrativeAreas,
  );
  loadAgencies();
  loadAdminAreas();

  return (
    <Box
      position={'fixed'}
      width={'300px'}
      height={'300px'}
      left={0}
      bottom={0}
      zIndex={1000}
      display={'flex'}
      flexDirection={'column'}
      overflow={'scroll'}
    >
      {/* {        JSON.stringify(popupProperties)} */}
      {properties.map((property) => (
        <PropertyRow
          key={`${property.properties.PropertyTypeId === PropertyTypes.BUILDING ? 'Building' : 'Land'}-${property.properties.Id}`}
          id={property.properties.Id}
          propertyTypeId={property.properties.PropertyTypeId}
          classificationId={property.properties.ClassificationId}
          title={
            // Buildings get name, unless it's all numbers or empty, then get address
            // Parcels use PID or PIN
            property.properties.PropertyTypeId === PropertyTypes.BUILDING
              ? property.properties.Name.match(/^\d*$/) || property.properties.Name == ''
                ? property.properties.Address1
                : property.properties.Name
              : pidFormatter(property.properties.PID) ?? String(property.properties.PIN)
          }
          content1={
            adminAreaData?.find((aa) => aa.Id === property.properties.AdministrativeAreaId)
              ?.Name ?? 'No Administrative Area'
          }
          content2={
            agencyData?.find((a) => a.Id === property.properties.AgencyId)?.Name ?? 'No Agency'
          }
        />
      ))}
    </Box>
  );
};

export default ClusterPopup;
