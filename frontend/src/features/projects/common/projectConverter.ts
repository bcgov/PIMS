import { NoteTypes, IProjectNote } from 'features/projects/common';
import {
  IApiProject,
  IProjectProperty,
  IApiProperty,
  initialValues,
  AgencyResponses,
} from './interfaces';
import { IProject, IProperty } from '.';
import { IFiscal, IEvaluation } from 'actions/parcelsActions';
import { FiscalKeys } from 'constants/fiscalKeys';
import { getCurrentFiscalYear, formatDate } from 'utils';
import _ from 'lodash';
import { EvaluationKeys } from 'constants/evaluationKeys';
import moment from 'moment';

export const getCurrentFiscal = (fiscals: IFiscal[], key: FiscalKeys) => {
  const currentFiscal = getCurrentFiscalYear();
  return _.find(fiscals, { fiscalYear: currentFiscal, key: key });
};

export const getMostRecentEvaluation = (
  evaluations: IEvaluation[],
  key: EvaluationKeys,
): IEvaluation | undefined => {
  const mostRecentEvaluation = _.find(_.orderBy(evaluations, 'date', 'desc'), { key: key });
  return mostRecentEvaluation;
};

/**
 * Get the most recent appraisal, restricted to within one year of either the current year or the year the project was disposed on.
 * @param evaluations all evaluations for the property.
 * @param disposedOn the date the project was disposed on, may be undefined.
 */
export const getMostRecentAppraisal = (
  evaluations: IEvaluation[],
  disposedOn?: Date | string,
): IEvaluation | undefined => {
  let targetDate = moment();
  if (disposedOn) {
    targetDate = moment(disposedOn, 'YYYY-MM-DD');
  }
  const evaluationsForYear = _.filter(evaluations, evaluation => {
    return (
      moment
        .duration(moment(evaluation.date, 'YYYY-MM-DD').diff(targetDate))
        .abs()
        .asYears() < 1
    );
  });
  return getMostRecentEvaluation(evaluationsForYear, EvaluationKeys.Appraised);
};

export const getFlatProjectNotes = (project: IApiProject) => {
  const notes: IProjectNote[] = [];
  Object.values(NoteTypes)
    .filter((key: any) => isNaN(Number(NoteTypes[key])))
    .forEach(type => {
      const matchingNote = _.find(project.notes, { noteType: type });
      notes.push({
        id: matchingNote?.id,
        noteType: type,
        note: matchingNote?.note ?? '',
        projectId: project.id,
        rowVersion: matchingNote?.rowVersion,
      });
    });
  return notes;
};

export const toFlatProject = (project?: IApiProject) => {
  if (!project) {
    return undefined;
  }
  const flatProperties = project.properties.map(pp => {
    const apiProperty: IApiProperty = (pp.building ?? pp.parcel) as IApiProperty;
    const assessed = getMostRecentEvaluation(apiProperty.evaluations, EvaluationKeys.Assessed);
    const appraised = getMostRecentAppraisal(apiProperty.evaluations, project.disposedOn);
    const netBook = getCurrentFiscal(apiProperty.fiscals, FiscalKeys.NetBook);
    const estimated = getCurrentFiscal(apiProperty.fiscals, FiscalKeys.Estimated);
    const property: IProperty = {
      id: apiProperty.id,
      projectPropertyId: pp.id,
      parcelId: apiProperty.parcelId ?? apiProperty.id,
      pid: apiProperty.pid ?? '',
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
      address: `${apiProperty.address?.line1 ?? ''} , ${apiProperty.address?.administrativeArea ??
        ''}`,
      administrativeArea: apiProperty.address?.administrativeArea ?? '',
      province: apiProperty.address?.province ?? '',
      postal: apiProperty.address?.postal ?? '',
      assessed: (assessed?.value as number) ?? 0,
      assessedDate: assessed?.date,
      assessedFirm: assessed?.firm,
      assessedRowVersion: assessed?.rowVersion,
      appraised: (appraised?.value as number) ?? 0,
      appraisedDate: appraised?.date,
      appraisedFirm: appraised?.firm,
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
  //always copy the project values over initial values, this ensures that formik's requirement of non-undefined fields is satisfied.
  const flatProject: IProject = {
    ...initialValues,
    ...project,
    properties: flatProperties,
    notes: getFlatProjectNotes(project),
  };
  return flatProject;
};

/** create api evaluation objects based on flat app evaluation structure */
const getApiEvaluations = (property: IProperty): IEvaluation[] => {
  const evaluations: IEvaluation[] = [];
  evaluations.push({
    parcelId: property.propertyTypeId === 0 ? property.id : undefined,
    buildingId: property.propertyTypeId === 1 ? property.id : undefined,
    value: property.appraised,
    date: property.appraisedDate ?? formatDate(new Date()),
    rowVersion: property.appraisedRowVersion,
    key: EvaluationKeys.Appraised,
    firm: property.appraisedFirm ?? '',
  });
  evaluations.push({
    parcelId: property.propertyTypeId === 0 ? property.id : undefined,
    buildingId: property.propertyTypeId === 1 ? property.id : undefined,
    value: property.assessed,
    date: property.assessedDate ?? formatDate(new Date()),
    rowVersion: property.assessedRowVersion,
    key: EvaluationKeys.Assessed,
    firm: property.assessedFirm ?? '',
  });

  return evaluations;
};

const toApiProperty = (property: IProperty): IApiProperty => {
  const apiProperty: IApiProperty = {
    id: property.id,
    parcelId: property.propertyTypeId === 0 ? property.id : undefined,
    buildingId: property.propertyTypeId === 1 ? property.id : undefined,
    pid: property.pid,
    pin: Number(property.pin),
    projectNumber: property.projectNumber ?? '',
    latitude: property.latitude,
    longitude: property.longitude,
    classificationId: property.classificationId,
    description: property.description,
    address: {
      id: property.addressId,
      line1: property.address,
      administrativeArea: property.administrativeArea,
      postal: property.postal,
      provinceId: property.province,
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
  const properties = project.properties?.map((property: IProperty) => {
    const projectProperty: IProjectProperty = {
      id: property.projectPropertyId,
      projectNumber: project.projectNumber,
      propertyType: property.propertyTypeId === 0 ? 'Land' : 'Building',
      parcelId: property.propertyTypeId === 0 ? property.id : undefined,
      parcel: property.propertyTypeId === 0 ? toApiProperty(property) : undefined,
      buildingId: property.propertyTypeId === 1 ? property.id : undefined,
      building: property.propertyTypeId === 1 ? toApiProperty(property) : undefined,
    };
    return projectProperty;
  });

  const projectAgencyResponses = _.filter(
    project.projectAgencyResponses,
    par =>
      par.rowVersion !== undefined ||
      (par.offerAmount !== undefined && par.offerAmount > 0) ||
      par.response !== AgencyResponses.Ignore ||
      par.note !== undefined ||
      par.receivedOn !== undefined,
  );

  const apiProject: IApiProject = {
    ...project,
    properties: properties,
    projectAgencyResponses: projectAgencyResponses,
    exemptionRationale: project.exemptionRationale,
    exemptionRequested: project.exemptionRequested,
    netBook: Number(project.netBook),
    estimated: Number(project.estimated),
    assessed: Number(project.assessed),
    appraised: project.appraised,
    notes: project.notes.filter(note => note.id || note.note),
  };
  // convert all empty strings (required by formik) to undefined
  Object.keys(apiProject).forEach(key => {
    (apiProject as any)[key] =
      (apiProject as any)[key] === '' ? undefined : (apiProject as any)[key];
  });
  return apiProject;
};
