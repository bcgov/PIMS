import {
  EvaluationKeyName,
  FiscalKeyName,
  IEvaluationModel,
  IFiscalModel,
  PropertyType,
} from 'hooks/api';
import { IProjectBuildingModel, IProjectParcelModel } from 'hooks/api/projects/disposals';
import { ISearchPropertyModel } from 'hooks/api/properties/search';
import { IProjectForm } from '../../interfaces';
import { convertToPropertyTypeName, toPropertyForm } from '../../utils';

export const toProjectProperty = (project: IProjectForm, property: ISearchPropertyModel) => {
  const parcel: IProjectParcelModel | undefined =
    property.propertyTypeId === PropertyType.Parcel ||
    property.propertyTypeId === PropertyType.Subdivision
      ? {
          id: property.id,
          propertyTypeId: property.propertyTypeId,
          pid: property.pid ?? '',
          name: property.name,
          agency: property.agencyCode,
          agencyFullName: property.agency,
          subAgency: property.subAgencyCode,
          subAgencyFullName: property.subAgency,
          latitude: property.latitude ?? 0,
          longitude: property.longitude ?? 0,
          address: {
            id: property.addressId,
            line1: property.address,
            administrativeArea: property.administrativeArea,
            provinceId: property.province,
            province: property.province,
          },
          classificationId: property.classificationId,
          classification: property.classification,
          projectNumbers: property.projectNumbers,
          isSensitive: property.isSensitive,
          isVisibleToOtherAgencies: false,
          landArea: property.landArea ?? 0,
          landLegalDescription: property.landLegalDescription,
          buildings: [],
          parcels: [],
          evaluations: [],
          fiscals: [],
        }
      : undefined;

  const building: IProjectBuildingModel | undefined =
    property.propertyTypeId === PropertyType.Building
      ? {
          id: property.id,
          propertyTypeId: property.propertyTypeId,
          parcelId: 0,
          name: property.name,
          latitude: property.latitude ?? 0,
          longitude: property.longitude ?? 0,
          agency: property.agencyCode,
          agencyFullName: property.agency,
          subAgency: property.subAgencyCode,
          subAgencyFullName: property.subAgency,
          address: {
            id: property.addressId,
            line1: property.address,
            administrativeArea: property.administrativeArea,
            provinceId: property.province,
            province: property.province,
          },
          classificationId: property.classificationId,
          classification: property.classification,
          projectNumbers: property.projectNumbers,
          isSensitive: property.isSensitive,
          isVisibleToOtherAgencies: false,
          buildingConstructionTypeId: property.constructionTypeId ?? 0,
          buildingConstructionType: property.constructionType ?? '',
          buildingPredominateUseId: property.predominateUseId ?? 0,
          buildingPredominateUse: property.predominateUse ?? '',
          buildingOccupantTypeId: property.occupantTypeId ?? 0,
          buildingOccupantType: property.occupantType ?? '',
          buildingFloorCount: property.floorCount ?? 0,
          transferLeaseOnSale: property.transferLeaseOnSale ?? false,
          rentableArea: property.rentableArea ?? 0,
          landArea: property.landArea ?? 0,
          evaluations: [],
          fiscals: [],
        }
      : undefined;

  const evaluations: IEvaluationModel[] = [];
  if (property.assessedLand !== undefined)
    evaluations.push({
      parcelId: parcel?.id,
      buildingId: building?.id,
      date: property.assessedLandDate ?? new Date(),
      key: EvaluationKeyName.Assessed,
      value: property.assessedLand,
    });
  if (property.assessedBuilding !== undefined)
    evaluations.push({
      parcelId: parcel?.id,
      buildingId: building?.id,
      date: property.assessedLandDate ?? new Date(),
      key:
        property.propertyTypeId === PropertyType.Building
          ? EvaluationKeyName.Assessed
          : EvaluationKeyName.Improvements,
      value: property.assessedBuilding,
    });

  const fiscals: IFiscalModel[] = [];
  if (property.netBook !== undefined)
    fiscals.push({
      parcelId: parcel?.id,
      buildingId: building?.id,
      fiscalYear: property.netBookFiscalYear ?? new Date().getFullYear(),
      key: FiscalKeyName.NetBook,
      value: property.netBook,
    });

  if (parcel) {
    parcel.evaluations = evaluations;
    parcel.fiscals = fiscals;
  } else if (building) {
    building.evaluations = evaluations;
    building.fiscals = fiscals;
  }

  return toPropertyForm({
    id: 0,
    projectId: project.id,
    propertyType: convertToPropertyTypeName(property.propertyTypeId),
    parcelId: parcel?.id,
    parcel,
    buildingId: building?.id,
    building,
  });
};
