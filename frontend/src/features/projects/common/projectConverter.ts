import { IProjectNote } from 'features/projects/common';
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
import { getCurrentFiscalYear, formatDate, stringToNull } from 'utils';
import _ from 'lodash';
import moment from 'moment';
import { NoteTypes, PropertyTypes, EvaluationKeys, PropertyTypeNames } from 'constants/index';

export const getCurrentFiscal = (fiscals: IFiscal[], key: FiscalKeys) => {
  const currentFiscal = getCurrentFiscalYear();
  return _.find(fiscals, { fiscalYear: currentFiscal, key: key });
};

const currentYear = moment().year();

/**
 * Get the most recent evaluation matching the current year and passed evaluation type.
 * @param evaluations a list of evaluations belonging to this project
 * @param key only return evaluations matching this key
 */
export const getCurrentYearEvaluation = (
  evaluations: IEvaluation[],
  key: EvaluationKeys,
): IEvaluation | undefined => {
  const currentYearEvaluations = evaluations.filter(
    (evaluation: IEvaluation) => moment(evaluation.date, 'YYYY-MM-DD').year() === currentYear,
  );
  return getMostRecentEvaluation(currentYearEvaluations, key);
};

/**
 * Get the most recent evaluation matching the passed evaluation type.
 * @param evaluations a list of evaluations belonging to this project
 * @param key only return evaluations matching this key
 */
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

export const toFlatProperty = (apiProperty: IApiProperty, pp?: IProjectProperty): IProperty => {
  const assessedLand = isParcelOrSubdivision(apiProperty as any)
    ? getCurrentYearEvaluation(apiProperty.evaluations, EvaluationKeys.Assessed)
    : undefined;
  const assessedBuilding = getCurrentYearEvaluation(
    apiProperty.evaluations,
    isParcelOrSubdivision(apiProperty as any)
      ? EvaluationKeys.Improvements
      : EvaluationKeys.Assessed,
  );
  const netBook = getCurrentFiscal(apiProperty.fiscals, FiscalKeys.NetBook);
  const market = getCurrentFiscal(apiProperty.fiscals, FiscalKeys.Market);
  return {
    id: apiProperty.id,
    projectNumbers: apiProperty.projectNumbers,
    projectPropertyId: pp?.id,
    parcelId: apiProperty.parcelId ?? apiProperty.id,
    pid: apiProperty.pid ?? '',
    name: apiProperty.name,
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
    assessedLand: (assessedLand?.value as number) ?? '',
    assessedLandDate: assessedLand?.date,
    assessedLandFirm: assessedLand?.firm,
    assessedLandRowVersion: assessedLand?.rowVersion,
    assessedBuilding: (assessedBuilding?.value as number) ?? '',
    assessedBuildingDate: assessedBuilding?.date,
    assessedBuildingFirm: assessedBuilding?.firm,
    assessedBuildingRowVersion: assessedBuilding?.rowVersion,
    netBook: (netBook?.value as number) ?? '',
    netBookFiscalYear: netBook?.fiscalYear as number,
    netBookRowVersion: netBook?.rowVersion,
    market: (market?.value as number) ?? '',
    marketFiscalYear: market?.fiscalYear as number,
    marketRowVersion: market?.rowVersion,
    propertyTypeId: !!pp?.parcel ? pp.parcel.propertyTypeId ?? 0 : 1,
    propertyType:
      pp?.propertyType ?? isParcelOrSubdivision(apiProperty as any)
        ? PropertyTypeNames.Land
        : PropertyTypeNames.Building,
    landArea: apiProperty.landArea,
    parcels: apiProperty.parcels ?? [],
  };
};

export const toFlatProject = (project?: IApiProject) => {
  if (!project) {
    return undefined;
  }
  const flatProperties = project.properties.map(pp => {
    const apiProperty: IApiProperty = (pp.building ?? pp.parcel) as IApiProperty;
    const property: IProperty = toFlatProperty(apiProperty, pp);
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

const isParcelOrSubdivision = (property: IProperty) =>
  [PropertyTypes.PARCEL, PropertyTypes.SUBDIVISION].includes(property?.propertyTypeId);

/** create api evaluation objects based on flat app evaluation structure */
const getApiEvaluations = (property: IProperty): IEvaluation[] => {
  const evaluations: IEvaluation[] = [];
  if (isParcelOrSubdivision(property)) {
    if (property.assessedLand !== '' && property.assessedLand !== undefined) {
      evaluations.push({
        parcelId: property.id,
        value: property.assessedLand,
        date: property.assessedLandDate ?? formatDate(new Date()),
        rowVersion: property.assessedLandRowVersion,
        key: EvaluationKeys.Assessed,
        firm: property.assessedLandFirm ?? '',
      });
    }
    if (property.assessedBuilding !== '' && property.assessedBuilding !== undefined) {
      evaluations.push({
        parcelId: property.id,
        value: property.assessedBuilding,
        date: property.assessedBuildingDate ?? formatDate(new Date()),
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
        date: property.assessedBuildingDate ?? formatDate(new Date()),
        rowVersion: property.assessedBuildingRowVersion,
        key: EvaluationKeys.Assessed,
        firm: property.assessedBuildingFirm ?? '',
      });
    }
  }

  return evaluations;
};

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

export const toApiProperty = (
  property: IProperty,
  useCurrentFiscal: boolean = false,
): IApiProperty => {
  const apiProperty: IApiProperty = {
    id: property.id,
    propertyTypeId: property.propertyTypeId,
    parcelId: isParcelOrSubdivision(property) ? property.id : undefined,
    buildingId: property.propertyTypeId === PropertyTypes.BUILDING ? property.id : undefined,
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
    fiscals: getApiFiscals(property, useCurrentFiscal),
    rowVersion: property.rowVersion,
  };
  return apiProperty;
};

export const toApiProject = (project: IProject) => {
  const properties = project.properties?.map((property: IProperty) => {
    const projectProperty: IProjectProperty = {
      id: property.projectPropertyId,
      projectNumber: project.projectNumber,
      propertyType: isParcelOrSubdivision(property) ? 'Land' : 'Building',
      parcelId: isParcelOrSubdivision(property) ? property.id : undefined,
      parcel: isParcelOrSubdivision(property) ? toApiProperty(property) : undefined,
      buildingId: property.propertyTypeId === PropertyTypes.BUILDING ? property.id : undefined,
      building:
        property.propertyTypeId === PropertyTypes.BUILDING ? toApiProperty(property) : undefined,
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
    netBook: stringToNull(project.netBook),
    market: stringToNull(project.market),
    assessed: stringToNull(project.assessed),
    appraised: stringToNull(project.appraised),
    notes: project.notes.filter(note => note.id || note.note),
  };
  // convert all empty strings (required by formik) to undefined
  Object.keys(apiProject).forEach(key => {
    (apiProject as any)[key] =
      (apiProject as any)[key] === '' ? undefined : (apiProject as any)[key];
  });
  return apiProject;
};
