PRINT 'Updating Building and Parcel Evaluations'

-- Update the records that were created or updated after April 1, 2022 which have a fiscal year/date in 2021
UPDATE [pims].[dbo].[BuildingEvaluations]
SET Date = DATEADD(year, 1, Date)
WHERE (CreatedOn >= '2022-04-01' AND Date = '2021-01-01') OR (UpdatedOn >= '2022-04-01' AND Date = '2021-01-01');

UPDATE [pims].[dbo].[ParcelEvaluations]
SET Date = DATEADD(year, 1, Date)
  WHERE ((CreatedOn >= '2022-04-01' AND Date = '2021-01-01') OR (UpdatedOn >= '2022-04-01' AND Date = '2021-01-01')
    OR (UpdatedById = 'C290F478-B483-4199-9F4E-7D2939C584F5' AND ParcelId IN (415, 416)))
    AND (ParcelId NOT IN (9734, 6427));