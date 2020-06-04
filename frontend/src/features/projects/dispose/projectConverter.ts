import { IApiProject, IProjectProperty, IApiProperty } from './interfaces';
import { IProject, IProperty } from '.';
import { IFiscal, IEvaluation } from 'actions/parcelsActions';
import { FiscalKeys } from 'constants/fiscalKeys';
import { getCurrentFiscalYear } from 'utils';
import _ from 'lodash';
import { EvaluationKeys } from 'constants/evaluationKeys';

export const getCurrentFiscal = (fiscals: IFiscal[], key: FiscalKeys) => {
  const currentFiscal = getCurrentFiscalYear();
  return _.find(fiscals, { fiscalYear: currentFiscal, key: key });
};
//TODO: test sort order
export const getMostRecentEvaluation = (evaluations: IEvaluation[], key: EvaluationKeys) => {
  return _.find(_.sortBy(evaluations, 'date'), { key: key });
};

export const toFlatProject = (project?: IApiProject) => {
  if (!project) {
    return undefined;
  }
  const flatProperties = project.projectProperties.map(pp => {
    const apiProperty: IApiProperty = (pp.parcel ?? pp.building) as IApiProperty;
    const assessed = getMostRecentEvaluation(apiProperty.evaluations, EvaluationKeys.Assessed);
    const appraised = getMostRecentEvaluation(apiProperty.evaluations, EvaluationKeys.Appraised);
    const netBook = getCurrentFiscal(apiProperty.fiscals, FiscalKeys.NetBook);
    const estimated = getCurrentFiscal(apiProperty.fiscals, FiscalKeys.Estimated);
    const property: IProperty = {
      id: apiProperty.id,
      parcelId: pp.parcelId,
      pid: apiProperty.pid ?? '',
      statusId: apiProperty.statusId,
      status: apiProperty.propertyStatus ?? '',
      description: apiProperty.description,
      landLegalDescription: apiProperty.landLegalDescription,
      zoning: apiProperty.zoning,
      zoningPotential: apiProperty.zoningPotential,
      isSensitive: apiProperty.isSensitive,
      latitude: apiProperty.latitude,
      longitude: apiProperty.longitude,
      agencyId: apiProperty.agencyId,
      agency: apiProperty.agency ?? '',
      agencyCode: apiProperty.agency ?? '',
      subAgency: apiProperty.subAgency,
      classification: apiProperty.classification ?? '',
      classificationId: apiProperty.classificationId,
      addressId: apiProperty.address?.id as number,
      address: `${apiProperty.address?.line1 ?? ''} , ${apiProperty.address?.city}`,
      cityId: apiProperty.address?.cityId as number,
      city: apiProperty.address?.city ?? '',
      province: apiProperty.address?.province ?? '',
      postal: apiProperty.address?.postal ?? '',
      municipality: apiProperty.municipality,
      assessed: (assessed?.value as number) ?? 0,
      assessedDate: assessed?.date,
      assessedRowVersion: assessed?.rowVersion,
      appraised: (appraised?.value as number) ?? 0,
      appraisedDate: appraised?.date,
      appraisedRowVersion: appraised?.rowVersion,
      netBook: (netBook?.value as number) ?? 0,
      netBookFiscalYear: netBook?.fiscalYear as number,
      netBookRowVersion: netBook?.rowVersion,
      estimated: (estimated?.value as number) ?? 0,
      estimatedFiscalYear: estimated?.fiscalYear as number,
      estimatedRowVersion: estimated?.rowVersion,
      propertyTypeId: pp.parcel ? 0 : 1,
      propertyType: pp.propertyType,
      landArea: apiProperty.landArea,
    };
    return property;
  });
  const flatProject: IProject = { ...project, properties: flatProperties };

  return flatProject;
};

const toApiProperty = (property: IProperty): IApiProperty => {
  const apiProperty: IApiProperty = {
    id: property.id,
    parcelId: property.propertyTypeId === 0 ? property.id : undefined,
    buildingId: property.propertyTypeId === 1 ? property.id : undefined,
    pid: property.pid,
    pin: property.pin,
    projectNumber: property.projectNumber ?? '',
    latitude: property.latitude,
    longitude: property.longitude,
    statusId: property.statusId,
    propertyStatus: property.status,
    classificationId: property.classificationId,
    description: property.description,
    address: {
      id: property.addressId,
      line1: property.address,
      cityId: property.cityId,
      postal: property.postal,
      provinceId: property.province,
    },
    zoning: property.zoning,
    zoningPotential: property.zoningPotential,
    municipality: property.municipality,
    agency: property.agency,
    subAgency: property.subAgency,
    agencyId: property.agencyId,
    isSensitive: property.isSensitive,
    landArea: property.landArea,
    landLegalDescription: property.landLegalDescription,
    buildings: [], //parcel buildings should not be relevant to this api.
    evaluations: [
      {
        parcelId: property.propertyTypeId === 0 ? property.id : undefined,
        buildingId: property.propertyTypeId === 1 ? property.id : undefined,
        value: property.assessed,
        date: property.assessedDate ?? new Date(),
        rowVersion: property.assessedRowVersion,
        key: EvaluationKeys.Assessed,
      },
      {
        parcelId: property.propertyTypeId === 0 ? property.id : undefined,
        buildingId: property.propertyTypeId === 1 ? property.id : undefined,
        value: property.appraised,
        date: property.appraisedDate ?? new Date(),
        rowVersion: property.appraisedRowVersion,
        key: EvaluationKeys.Appraised,
      },
    ],
    fiscals: [
      {
        parcelId: property.propertyTypeId === 0 ? property.id : undefined,
        buildingId: property.propertyTypeId === 1 ? property.id : undefined,
        value: property.netBook,
        fiscalYear: property.netBookFiscalYear ?? getCurrentFiscalYear(),
        rowVersion: property.netBookRowVersion,
        key: FiscalKeys.NetBook,
      },
      {
        parcelId: property.propertyTypeId === 0 ? property.id : undefined,
        buildingId: property.propertyTypeId === 1 ? property.id : undefined,
        value: property.estimated,
        fiscalYear: property.estimatedFiscalYear ?? getCurrentFiscalYear(),
        rowVersion: property.estimatedRowVersion,
        key: FiscalKeys.Estimated,
      },
    ],
    rowVersion: property.rowVersion,
  };
  return apiProperty;
};

export const toApiProject = (project: IProject) => {
  const projectProperties = project.properties.map(property => {
    const projectProperty: IProjectProperty = {
      projectNumber: project.projectNumber,
      propertyType: property.propertyTypeId === 0 ? 'Land' : 'Building',
      parcelId: property.propertyTypeId === 0 ? property.id : undefined,
      parcel: property.propertyTypeId === 0 ? toApiProperty(property) : undefined,
      buildingId: property.propertyTypeId === 1 ? property.id : undefined,
      building: property.propertyTypeId === 1 ? toApiProperty(property) : undefined,
    };
    return projectProperty;
  });

  const flatProject: IApiProject = {
    projectNumber: project.projectNumber,
    name: project.name,
    description: project.description,
    projectProperties: projectProperties,
    note: project.note,
    agencyId: project.agencyId,
    tierLevelId: project.tierLevelId,
    tasks: project.tasks,
    statusId: project.statusId,
    rowVersion: project.rowVersion,
  };
  return flatProject;
};
