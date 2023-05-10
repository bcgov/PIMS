import { IEvaluation, IFiscal } from 'actions/parcelsActions';
import { FiscalKeys } from 'constants/fiscalKeys';
import { EvaluationKeys, PropertyTypes } from 'constants/index';
import { IApiProperty, IProperty } from 'features/projects/interfaces';
import { formatDate, getCurrentFiscalYear } from 'utils';

export const toApiProperty = (
  property: IProperty,
  useCurrentFiscal: boolean = false,
): IApiProperty => {
  const apiProperty: IApiProperty = {
    id: property.id,
    propertyTypeId: property.propertyTypeId,
    parcelId: isParcelOrSubdivision(property) ? property.id : undefined,
    buildingId: property.propertyTypeId === PropertyTypes.BUILDING ? property.id : undefined,
    buildingTenancy: property.tenancy,
    pid: property.pid,
    pin: Number(property.pin),
    projectNumbers: property.projectNumbers ?? [],
    latitude: property.latitude,
    longitude: property.longitude,
    classificationId: property.classificationId,
    name: property.name,
    description: property.description,
    address: {
      id: property.addressId,
      line1: property.address,
      administrativeArea: property.administrativeArea,
      postal: property.postal,
      province: property.province,
      provinceId: property.province === 'British Columbia' ? 'BC' : '',
    },
    zoning: property.zoning ?? '',
    zoningPotential: property.zoningPotential ?? '',
    agency: property.agency,
    subAgency: property.subAgency,
    agencyId: property.agencyId,
    isSensitive: property.isSensitive,
    landArea: property.landArea,
    landLegalDescription: property.landLegalDescription,
    buildings: [], //parcel buildings should not be relevant to this api.
    evaluations: getApiEvaluations(property),
    fiscals: getApiFiscals(property, useCurrentFiscal),
    rowVersion: property.rowVersion,
  };
  return apiProperty;
};

const isParcelOrSubdivision = (property: IProperty) =>
  [PropertyTypes.PARCEL, PropertyTypes.SUBDIVISION].includes(property?.propertyTypeId);

/** create api fiscal objects based on flat app fiscal structure */
const getApiFiscals = (property: IProperty, useCurrentFiscal: boolean): IFiscal[] => {
  const fiscals: IFiscal[] = [];
  if (property.netBook !== '' && property.netBook !== undefined) {
    fiscals.push({
      parcelId: isParcelOrSubdivision(property) ? property.id : undefined,
      buildingId: property.propertyTypeId === PropertyTypes.BUILDING ? property.id : undefined,
      value: property.netBook,
      fiscalYear: !useCurrentFiscal
        ? property.netBookFiscalYear ?? getCurrentFiscalYear()
        : getCurrentFiscalYear(),
      rowVersion: property.netBookRowVersion,
      key: FiscalKeys.NetBook,
    });
  }
  if (property.market !== '' && property.market !== undefined) {
    fiscals.push({
      parcelId: isParcelOrSubdivision(property) ? property.id : undefined,
      buildingId: property.propertyTypeId === PropertyTypes.BUILDING ? property.id : undefined,
      value: property.market,
      fiscalYear: !useCurrentFiscal
        ? property.marketFiscalYear ?? getCurrentFiscalYear()
        : getCurrentFiscalYear(),
      rowVersion: property.marketRowVersion,
      key: FiscalKeys.Market,
    });
  }

  return fiscals;
};

/** create api evaluation objects based on flat app evaluation structure */
const getApiEvaluations = (property: IProperty): IEvaluation[] => {
  const evaluations: IEvaluation[] = [];
  if (isParcelOrSubdivision(property)) {
    if (property.assessedLand !== '' && property.assessedLand !== undefined) {
      evaluations.push({
        parcelId: property.id,
        value: property.assessedLand,
        date: formatDate(new Date()),
        rowVersion: property.assessedLandRowVersion,
        key: EvaluationKeys.Assessed,
        firm: property.assessedLandFirm ?? '',
      });
    }
    if (property.assessedBuilding !== '' && property.assessedBuilding !== undefined) {
      evaluations.push({
        parcelId: property.id,
        value: property.assessedBuilding,
        date: formatDate(new Date()),
        rowVersion: property.assessedBuildingRowVersion,
        key: EvaluationKeys.Improvements,
        firm: property.assessedBuildingFirm ?? '',
      });
    }
  } else {
    if (property.assessedBuilding !== '' && property.assessedBuilding !== undefined) {
      evaluations.push({
        buildingId: property.id,
        value: property.assessedBuilding,
        date: formatDate(new Date()),
        rowVersion: property.assessedBuildingRowVersion,
        key: EvaluationKeys.Assessed,
        firm: property.assessedBuildingFirm ?? '',
      });
    }
  }

  return evaluations;
};
