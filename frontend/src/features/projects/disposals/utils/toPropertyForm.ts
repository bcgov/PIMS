import { EvaluationKeyName, FiscalKeyName, PropertyTypeName } from 'hooks/api';
import { IProjectParcelModel, IProjectPropertyModel } from 'hooks/api/projects/disposals';
import moment from 'moment';
import { formatAddress } from 'utils';

import { IProjectPropertyForm } from '../interfaces';
import { convertToPropertyType, getMostRecentEvaluation, getMostRecentFiscal } from '.';

/**
 * Initialize form values from a property model.
 * @param model The original property model that you want to update with form values.
 * @returns A new instance of form values.
 */
export const toPropertyForm = (model: IProjectPropertyModel): IProjectPropertyForm => {
  const property = model.propertyType === PropertyTypeName.Building ? model.building : model.parcel;

  const netBook = getMostRecentFiscal(property?.fiscals ?? [], FiscalKeyName.NetBook);
  const assessed = getMostRecentEvaluation(property?.evaluations ?? [], EvaluationKeyName.Assessed);
  const assessedImprovements = getMostRecentEvaluation(
    property?.evaluations ?? [],
    EvaluationKeyName.Improvements,
  );
  const assessedDate = assessed?.date ?? assessedImprovements?.date;
  return {
    id: model.id,
    projectNumbers: property?.projectNumbers ?? [],
    propertyTypeId: convertToPropertyType(model.propertyType),
    propertyId: property?.id ?? 0,
    agencyCode: property?.agency ?? '',
    name: property?.name ?? '',
    address: property?.address ? formatAddress(property.address) : '',
    classificationId: property?.classificationId ?? 0,
    zoning: (property as IProjectParcelModel).zoning ?? '',
    zoningPotential: (property as IProjectParcelModel).zoningPotential ?? '',
    netBook: netBook?.value ?? '',
    assessedLand: model.propertyType === PropertyTypeName.Building ? '' : assessed?.value ?? '',
    assessedLandYear: !!assessedDate ? moment(assessedDate).year() : '',
    assessedImprovements:
      (model.propertyType === PropertyTypeName.Building
        ? assessed?.value
        : assessedImprovements?.value) ?? '',
  };
};
