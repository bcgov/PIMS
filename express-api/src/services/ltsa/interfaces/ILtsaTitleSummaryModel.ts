export interface ILtsaTitleSummaryResponse {
  titleSummaries: ILtsaTitleSummaryModel[];
}

export interface ILtsaTitleSummaryModel {
  titleNumber: string;
  landTitleDistrictCode: string;
  parcelIdentifier: string;
  status: string;
  firstOwner: string;
}
