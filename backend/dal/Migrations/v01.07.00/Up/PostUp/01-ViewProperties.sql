PRINT 'Updating View_Properties - Updating Assessment'
GO
-- This script provides a way to union both parcels and buildings into a single result of properties.
-- Updating view to support many-to-many parcels and buildings.TEMPORARY
CREATE OR ALTER VIEW dbo.[View_Properties] AS
SELECT
    p.[Id]
    , p.[RowVersion]
    , p.[PropertyTypeId]
    , p.[ClassificationId]
    , [Classification] = c.[Name]
    , p.[AgencyId]
    , [Agency] = ISNULL(pa.[Name], a.[Name])
    , [AgencyCode] = ISNULL(pa.[Code], a.[Code])
    , [SubAgency] = (
        SELECT CASE WHEN pa.[Id] IS NOT NULL
            THEN a.[Name]
            ELSE NULL
        END)
    , [SubAgencyCode] = (
        SELECT CASE WHEN pa.[Id] IS NOT NULL
            THEN a.[Code]
            ELSE NULL
        END)
    , p.[AddressId]
    , [Address] = TRIM(ISNULL(adr.[Address1], '') + ' ' + ISNULL(adr.[Address2], ''))
    , [AdministrativeArea] = adr.[AdministrativeArea]
    , [Province] = ap.[Name]
    , adr.[Postal]
    , p.[ProjectNumbers]
    , p.[Name]
    , p.[Description]
    , p.[Location]
    , p.[Boundary]
    , p.[IsSensitive]
    , p.[IsVisibleToOtherAgencies]

    -- Parcel Properties
    , p.[PID]
    , p.[PIN]
    , [LandArea] = p.[LandArea]
    , [LandLegalDescription] = p.[LandLegalDescription]
    , [Zoning] = p.[Zoning]
    , [ZoningPotential] = p.[ZoningPotential]

    -- Building Properties
    , [ParcelId] = p.[Id]
    , [BuildingConstructionTypeId] = 0
    , [BuildingConstructionType] = null
    , [BuildingFloorCount] = 0
    , [BuildingPredominateUseId] = 0
    , [BuildingPredominateUse] = null
    , [BuildingOccupantTypeId] = 0
    , [BuildingOccupantType] = null
    , [BuildingTenancy] = null
    , [RentableArea] = 0
    , [LeaseExpiry] = null
    , [OccupantName] = null
    , [TransferLeaseOnSale] = CAST(0 AS BIT)

    , [AssessedLand] = eas.[Value]
    , [AssessedLandDate] = eas.[Date]
    , [AssessedBuilding] = eim.[Value]
    , [AssessedBuildingDate] = eim.[Date]
    , [Market] = ISNULL(fe.[Value], 0)
    , [MarketFiscalYear] = fe.[FiscalYear]
    , [NetBook] = ISNULL(fn.[Value], 0)
    , [NetBookFiscalYear] = fn.[FiscalYear]
FROM dbo.[Parcels] p
LEFT JOIN (SELECT DISTINCT SubdivisionId FROM dbo.[ParcelParcels]) sp ON p.[Id] = sp.[SubdivisionId]
JOIN dbo.[PropertyClassifications] c ON p.[ClassificationId] = c.[Id]
JOIN dbo.[Agencies] a ON p.[AgencyId] = a.[Id]
LEFT JOIN dbo.[Agencies] pa ON a.[ParentId] = pa.[Id]
JOIN dbo.[Addresses] adr ON p.[AddressId] = adr.[Id]
JOIN dbo.[Provinces] ap ON adr.[ProvinceId] = ap.[Id]
OUTER APPLY (
    SELECT TOP 1
        [Value]
        , [Date]
    FROM dbo.[ParcelEvaluations]
    WHERE [ParcelId] = p.[Id]
        AND [Key] = 0 -- Assessed Land
    ORDER BY [Date] DESC
) AS eas
OUTER APPLY (
    SELECT TOP 1
        [Value]
        , [Date]
    FROM dbo.[ParcelEvaluations]
    WHERE [ParcelId] = p.[Id]
        AND [Key] = 2 -- Assessed Building
    ORDER BY [Date] DESC
) AS eim
OUTER APPLY (
    SELECT TOP 1
        [Value]
        , [FiscalYear]
    FROM dbo.[ParcelFiscals]
    WHERE [ParcelId] = p.[Id]
        AND [Key] = 1 -- Market
    ORDER BY [FiscalYear] DESC
) AS fe
OUTER APPLY (
    SELECT TOP 1
        [Value]
        , [FiscalYear]
    FROM dbo.[ParcelFiscals]
    WHERE [ParcelId] = p.[Id]
        AND [Key] = 0 -- NetBook
    ORDER BY [FiscalYear] DESC
) AS fn
UNION ALL
SELECT
    b.[Id]
    , b.[RowVersion]
    , b.[PropertyTypeId]
    , b.[ClassificationId]
    , [Classification] = c.[Name]
    , b.[AgencyId]
    , [Agency] = ISNULL(pa.[Name], a.[Name])
    , [AgencyCode] = ISNULL(pa.[Code], a.[Code])
    , [SubAgency] = (
        SELECT CASE WHEN pa.[Id] IS NOT NULL
            THEN a.[Name]
            ELSE NULL
        END)
    , [SubAgencyCode] = (
        SELECT CASE WHEN pa.[Id] IS NOT NULL
            THEN a.[Code]
            ELSE NULL
        END)
    , b.[AddressId]
    , [Address] = TRIM(ISNULL(adr.[Address1], '') + ' ' + ISNULL(adr.[Address2], ''))
    , [AdministrativeArea] = adr.[AdministrativeArea]
    , [Province] = ap.[Name]
    , adr.[Postal]
    , b.[ProjectNumbers]
    , b.[Name]
    , b.[Description]
    , b.[Location]
    , b.[Boundary]
    , b.[IsSensitive]
    , b.[IsVisibleToOtherAgencies]

    -- Parcel Properties
    , [PID] = p.[PID]
    , [PIN] = p.[PIN]
    , [LandArea] = p.[LandArea]
    , [LandLegalDescription] = p.[LandLegalDescription]
    , [Zoning] = p.[Zoning]
    , [ZoningPotential] = p.[ZoningPotential]

    -- Building Properties
    , [ParcelId] = p.[Id]
    , [BuildingConstructionTypeId] = b.[BuildingConstructionTypeId]
    , [BuildingConstructionType] = bct.[Name]
    , [BuildingFloorCount] = b.[BuildingFloorCount]
    , [BuildingPredominateUseId] = b.[BuildingPredominateUseId]
    , [BuildingPredominateUse] = bpu.[Name]
    , [BuildingOccupantTypeId] = b.[BuildingOccupantTypeId]
    , [BuildingOccupantType] = bot.[Name]
    , [BuildingTenancy] = b.[BuildingTenancy]
    , [RentableArea] = b.[RentableArea]
    , [LeaseExpiry] = b.[LeaseExpiry]
    , [OccupantName] = b.[OccupantName]
    , [TransferLeaseOnSale] = b.[TransferLeaseOnSale]

    , [AssessedLand] = null
    , [AssessedLandDate] = null
    , [AssessedBuilding] = eim.[Value]
    , [AssessedBuildingDate] = eim.[Date]
    , [Market] = ISNULL(fe.[Value], 0)
    , [MarketFiscalYear] = fe.[FiscalYear]
    , [NetBook] = ISNULL(fn.[Value], 0)
    , [NetBookFiscalYear] = fn.[FiscalYear]
FROM dbo.[Buildings] b
LEFT JOIN dbo.[ParcelBuildings] pb ON b.[Id] = pb.[BuildingId]
LEFT JOIN dbo.[Parcels] p ON pb.[ParcelId] = p.[Id]
JOIN dbo.[PropertyClassifications] c ON b.[ClassificationId] = c.[Id]
JOIN dbo.[Agencies] a ON b.[AgencyId] = a.[Id]
LEFT JOIN dbo.[Agencies] pa ON a.[ParentId] = pa.[Id]
JOIN dbo.[Addresses] adr ON b.[AddressId] = adr.[Id]
JOIN dbo.[Provinces] ap ON adr.[ProvinceId] = ap.[Id]
JOIN dbo.[BuildingConstructionTypes] bct ON b.[BuildingConstructionTypeId] = bct.[Id]
JOIN dbo.[BuildingOccupantTypes] bot ON b.[BuildingOccupantTypeId] = bot.[Id]
JOIN dbo.[BuildingPredominateUses] bpu ON b.[BuildingPredominateUseId] = bpu.[Id]
OUTER APPLY (
    SELECT TOP 1
        [Value]
        , [Date]
    FROM dbo.[BuildingEvaluations]
    WHERE [BuildingId] = b.[Id]
        AND [Key] = 0 -- Assessed
    ORDER BY [Date] DESC
) AS eim
OUTER APPLY (
    SELECT TOP 1
        [Value]
        , [FiscalYear]
    FROM dbo.[BuildingFiscals]
    WHERE [BuildingId] = b.[Id]
        AND [Key] = 1 -- Market
    ORDER BY [FiscalYear] DESC
) AS fe
OUTER APPLY (
    SELECT TOP 1
        [Value]
        , [FiscalYear]
    FROM dbo.[BuildingFiscals]
    WHERE [BuildingId] = b.[Id]
        AND [Key] = 0 -- NetBook
    ORDER BY [FiscalYear] DESC
) AS fn
