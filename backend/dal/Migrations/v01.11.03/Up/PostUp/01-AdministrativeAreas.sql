PRINT 'Adding [AdministrativeAreas]'

MERGE INTO dbo.[AdministrativeAreas] dest
USING (
  VALUES (
  'Valdes Island',
  'Valdes Isl',
  'Cowichan Valley Regional District'
  ), (
  'Stopper Islands',
  'Stopper Isl',
  'Alberni-Clayoquot Regional District'
  )
) AS src (
  [Name]
  , [Abbreviation]
  , [GroupName])
ON dest.Name = src.[Name]
WHEN MATCHED THEN
UPDATE
SET dest.[Abbreviation] = src.[Abbreviation]
  , dest.[GroupName] = src.[GroupName]
WHEN NOT MATCHED THEN
INSERT (
  [Name]
  , [Abbreviation]
  , [GroupName]
) VALUES (
  src.[Name]
  , src.[Abbreviation]
  , src.[GroupName]
);
