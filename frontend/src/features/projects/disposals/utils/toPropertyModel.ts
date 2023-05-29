import { EvaluationKeyName, FiscalKeyName, PropertyType } from 'hooks/api';
import {
  IProjectBuildingModel,
  IProjectParcelModel,
  IProjectPropertyModel,
} from 'hooks/api/projects/disposals';

import { IProjectPropertyForm } from '../interfaces';
import { convertToPropertyTypeName } from '.';
import { getMostRecentEvaluation } from './getMostRecentEvaluation';
import { getMostRecentFiscal } from './getMostRecentFiscal';

/**
 * Converts the form values to a model that can be sent to the api.
 * @param values Property form values.
 * @param model Original model (if it exists).
 * @returns A property model.
 */
export const toPropertyModel = (
  values: IProjectPropertyForm,
  model?: IProjectPropertyModel,
): IProjectPropertyModel => {
  const fiscals = model?.building?.fiscals ?? model?.parcel?.fiscals ?? [];
  const evaluations = model?.building?.evaluations ?? model?.parcel?.evaluations ?? [];

  const netBook = getMostRecentFiscal(fiscals, FiscalKeyName.NetBook);
  const assessed = getMostRecentEvaluation(evaluations, EvaluationKeyName.Assessed);

  if (netBook) netBook.value = Number(values.netBook);

  if (values.propertyTypeId === PropertyType.Building) {
    if (assessed) assessed.value = Number(values.assessedImprovements);
    const building = {
      ...model?.building,
      id: values.propertyId,
      propertyTypeId: values.propertyTypeId,
      classificationId: values.classificationId,
      zoning: values.zoning,
      zoningPotential: values.zoningPotential,
      name: values.name,
      evaluations: assessed ? [assessed] : [],
      fiscals: netBook ? [netBook] : [],
    } as unknown as IProjectBuildingModel;

    return {
      id: values.id,
      projectId: 0,
      propertyType: convertToPropertyTypeName(values.propertyTypeId),
      buildingId: values.propertyId,
      building: building,
    };
  }

  const improvements = getMostRecentEvaluation(evaluations, EvaluationKeyName.Improvements);
  const assessedLand = [];
  if (assessed) {
    assessed.value = Number(values.assessedLand);
    assessedLand.push(assessed);
  }
  if (improvements) {
    improvements.value = Number(values.assessedImprovements);
    assessedLand.push(improvements);
  }

  const parcel = {
    ...model?.parcel,
    id: values.propertyId,
    propertyTypeId: values.propertyTypeId,
    classificationId: values.classificationId,
    zoning: values.zoning,
    // zoningPotential: values.zoningPotential,
    name: values.name,
    evaluations: assessedLand,
    fiscals: netBook ? [netBook] : [],
  } as unknown as IProjectParcelModel;

  return {
    id: values.id,
    projectId: 0,
    propertyType: convertToPropertyTypeName(values.propertyTypeId),
    parcelId: values.propertyId,
    parcel: parcel,
  };
};
