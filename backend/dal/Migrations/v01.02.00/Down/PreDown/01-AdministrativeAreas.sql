PRINT 'Backup AdministrativeAreas'

-- Create temporary table to store the administrative area values
SELECT aa.[Id] AS [Id]
    , aa.[Abbreviation] AS [Code]
    , aa.[Name] AS [Name]
INTO #AdministrativeAreas
FROM dbo.[AdministrativeAreas] aa

SET IDENTITY_INSERT #AdministrativeAreas ON

-- Add additional records for any unique administrative areas stored in an address
INSERT INTO #AdministrativeAreas (
    [Id]
    , [Name]
)
SELECT
    (SELECT MAX([Id]) + 1 FROM #AdministrativeAreas)
    , aa.[AdministrativeArea]
FROM (
    SELECT
        DISTINCT a.[AdministrativeArea]
    FROM dbo.[Addresses] a
    WHERE a.[AdministrativeArea] NOT IN (
        SELECT [Name]
        FROM #AdministrativeAreas
        )
    ) aa
    
SET IDENTITY_INSERT #AdministrativeAreas OFF
