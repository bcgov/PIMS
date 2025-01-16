import { propertyTypeMapper, PropertyTypes } from '@/constants/propertyTypes';
import { LookupContext } from '@/contexts/lookupContext';
import { Building, BuildingEvaluation, BuildingFiscal } from '@/hooks/api/useBuildingsApi';
import { Parcel, ParcelEvaluation, ParcelFiscal } from '@/hooks/api/useParcelsApi';
import { pidFormatter } from '@/utilities/formatters';
import { useContext } from 'react';

/**
 * Used to return a standard way of mapping property data into an array of objects for export.
 * @returns A function that maps a list of properties to an array of objects for export.
 */
export const getPropertyExportMap = () => {
  const lookup = useContext(LookupContext);
  return (data: ((Parcel | Building) & { ProjectNumber: string })[]) => {
    return data.map((property) => {
      return {
        Type: propertyTypeMapper(property.PropertyTypeId),
        Classification: lookup.getLookupValueById('Classifications', property.ClassificationId)
          ?.Name,
        Name: property.Name,
        Description: property.Description,
        Ministry: lookup.getLookupValueById('Agencies', property.AgencyId)?.ParentId
          ? lookup.data.Agencies.find(
              (a) => a.Id === lookup.getLookupValueById('Agencies', property.AgencyId)?.ParentId,
            )?.Name
          : lookup.getLookupValueById('Agencies', property.AgencyId)?.Name,
        Agency: lookup.getLookupValueById('Agencies', property.AgencyId)?.Name,
        Address: property.Address1,
        'Administrative Area': lookup.getLookupValueById(
          'AdministrativeAreas',
          property.AdministrativeAreaId,
        )?.Name,
        Postal: property.Postal,
        PID: pidFormatter(property.PID),
        PIN: property.PIN,
        'Is Sensitive': property.IsSensitive,
        'Assessed Value': property.Evaluations?.length
          ? property.Evaluations.sort(
              (
                a: ParcelEvaluation | BuildingEvaluation,
                b: ParcelEvaluation | BuildingEvaluation,
              ) => b.Year - a.Year,
            ).at(0).Value
          : '',
        'Assessment Year': property.Evaluations?.length
          ? property.Evaluations.sort(
              (
                a: ParcelEvaluation | BuildingEvaluation,
                b: ParcelEvaluation | BuildingEvaluation,
              ) => b.Year - a.Year,
            ).at(0).Year
          : '',
        'Netbook Value': property.Fiscals?.length
          ? property.Fiscals.sort(
              (a: ParcelFiscal | BuildingFiscal, b: ParcelFiscal | BuildingFiscal) =>
                b.FiscalYear - a.FiscalYear,
            ).at(0).Value
          : '',
        'Netbook Year': property.Fiscals?.length
          ? property.Fiscals.sort(
              (a: ParcelFiscal | BuildingFiscal, b: ParcelFiscal | BuildingFiscal) =>
                b.FiscalYear - a.FiscalYear,
            ).at(0).FiscalYear
          : '',
        'Parcel Land Area':
          property.PropertyTypeId === PropertyTypes.LAND ? (property as Parcel).LandArea : '',
        'Building Total Area':
          property.PropertyTypeId === PropertyTypes.BUILDING
            ? (property as Building).TotalArea
            : '',
        'Building Predominate Use':
          property.PropertyTypeId === PropertyTypes.BUILDING
            ? lookup.getLookupValueById(
                'PredominateUses',
                (property as Building).BuildingPredominateUseId,
              )?.Name
            : '',
        'Building Construction Type':
          property.PropertyTypeId === PropertyTypes.BUILDING
            ? lookup.getLookupValueById(
                'ConstructionTypes',
                (property as Building).BuildingConstructionTypeId,
              )?.Name
            : '',
        'Building Tenancy':
          property.PropertyTypeId === PropertyTypes.BUILDING
            ? (property as Building).BuildingTenancy
            : '',
        Latitude: property.Location.y, // This seems backwards, but it's how the database stores it.
        Longitude: property.Location.x,
        'Active Project Number': property.ProjectNumber,
      };
    });
  };
};
