PRINT 'Creating View_Properties'
GO
-- This script provides a way to union both parcels and buildings into a single result of properties.
CREATE VIEW dbo.[View_Properties] AS
SELECT
    p.[Id]
    , [PropertyTypeId] = 0
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
    , [City] = ac.[Name]
    , [Province] = ap.[Name]
    , adr.[Postal]
    , p.[ProjectNumber]
    , p.[Name]
    , p.[Description]
    , p.[Latitude]
    , p.[Longitude]
    , p.[IsSensitive]
    , p.[IsVisibleToOtherAgencies]

    -- Parcel Properties
    , p.[PID]
    , p.[PIN]
    , [LandArea] = p.[LandArea]
    , [LandLegalDescription] = p.[LandLegalDescription]
    , [Municipality] = p.[Municipality]
    , [Zoning] = p.[Zoning]
    , [ZoningPotential] = p.[ZoningPotential]

    -- Building Properties
    , [LocalId] = null
    , [ParcelId] = null
    , [BuildingConstructionTypeId] = 0
    , BuildingConstructionType = null
    , [BuildingFloorCount] = 0
    , [BuildingPredominateUseId] = 0
    , BuildingPredominateUse = null
    , [BuildingOccupantTypeId] = 0
    , BuildingOccupantType = null
    , [BuildingTenancy] = null
    , [RentableArea] = 0
    , [LeaseExpiry] = null
    , [OccupantName] = null
    , [TransferLeaseOnSale] = CAST(0 AS BIT)

    , [Assessed] = ISNULL(eas.[Value], 0)
    , [AssessedDate] = eas.[Date]
    , [Appraised] = ISNULL(eap.[Value], 0)
    , [AppraisedDate] = eap.[Date]
    , [Estimated] = ISNULL(fe.[Value], 0)
    , [EstimatedFiscalYear] = fe.[FiscalYear]
    , [NetBook] = ISNULL(fn.[Value], 0)
    , [NetBookFiscalYear] = fn.[FiscalYear]
FROM dbo.[Parcels] p
JOIN dbo.[PropertyClassifications] c ON p.[ClassificationId] = c.[Id]
JOIN dbo.[Agencies] a ON p.[AgencyId] = a.[Id]
LEFT JOIN dbo.[Agencies] pa ON a.[ParentId] = pa.[Id]
JOIN dbo.[Addresses] adr ON p.[AddressId] = adr.[Id]
JOIN dbo.[Cities] ac ON adr.[CityId] = ac.[Id]
JOIN dbo.[Provinces] ap ON adr.[ProvinceId] = ap.[Id]
OUTER APPLY (
    SELECT TOP 1
        [Value]
        , [Date]
    FROM dbo.[ParcelEvaluations]
    WHERE [ParcelId] = p.[Id]
        AND [Key] = 0 -- [Assessed]
    ORDER BY [Date] DESC
) AS eas
OUTER APPLY (
    SELECT TOP 1
        [Value]
        , [Date]
    FROM dbo.[ParcelEvaluations]
    WHERE [ParcelId] = p.[Id]
        AND [Key] = 1 -- Appraised
    ORDER BY [Date] DESC
) AS eap
OUTER APPLY (
    SELECT TOP 1
        [Value]
        , [FiscalYear]
    FROM dbo.[ParcelFiscals]
    WHERE [ParcelId] = p.[Id]
        AND [Key] = 1 -- Estimated
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
UNION
SELECT
    b.[Id]
    , [PropertyTypeId] = 1
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
    , [City] = ac.[Name]
    , [Province] = ap.[Name]
    , adr.[Postal]
    , b.[ProjectNumber]
    , b.[Name]
    , b.[Description]
    , b.[Latitude]
    , b.[Longitude]
    , b.[IsSensitive]
    , b.[IsVisibleToOtherAgencies]

    -- Parcel Properties
    , [PID] = p.[PID]
    , [PIN] = p.[PIN]
    , [LandArea] = p.[LandArea]
    , [LandLegalDescription] = p.[LandLegalDescription]
    , [Municipality] = p.[Municipality]
    , [Zoning] = p.[Zoning]
    , [ZoningPotential] = p.[ZoningPotential]

    -- Building Properties
    , [LocalId] = b.[LocalId]
    , [ParcelId] = b.[ParcelId]
    , [BuildingConstructionTypeId] = b.[BuildingConstructionTypeId]
    , BuildingConstructionType = bct.[Name]
    , [BuildingFloorCount] = b.[BuildingFloorCount]
    , [BuildingPredominateUseId] = b.[BuildingPredominateUseId]
    , BuildingPredominateUse = bpu.[Name]
    , [BuildingOccupantTypeId] = b.[BuildingOccupantTypeId]
    , BuildingOccupantType = bot.[Name]
    , [BuildingTenancy] = b.[BuildingTenancy]
    , [RentableArea] = b.[RentableArea]
    , [LeaseExpiry] = b.[LeaseExpiry]
    , [OccupantName] = b.[OccupantName]
    , [TransferLeaseOnSale] = b.[TransferLeaseOnSale]

    , [Assessed] = ISNULL(eas.[Value], 0)
    , [AssessedDate] = eas.[Date]
    , [Appraised] = ISNULL(eap.[Value], 0)
    , [AppraisedDate] = eap.[Date]
    , [Estimated] = ISNULL(fe.[Value], 0)
    , [EstimatedFiscalYear] = fe.[FiscalYear]
    , [NetBook] = ISNULL(fn.[Value], 0)
    , [NetBookFiscalYear] = fn.[FiscalYear]
FROM dbo.[Buildings] b
JOIN dbo.[Parcels] p ON b.[ParcelId] = p.[Id]
JOIN dbo.[PropertyClassifications] c ON b.[ClassificationId] = c.[Id]
JOIN dbo.[Agencies] a ON b.[AgencyId] = a.[Id]
LEFT JOIN dbo.[Agencies] pa ON a.[ParentId] = pa.[Id]
JOIN dbo.[Addresses] adr ON b.[AddressId] = adr.[Id]
JOIN dbo.[Cities] ac ON adr.[CityId] = ac.[Id]
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
        AND [Key] = 0 -- [Assessed]
    ORDER BY [Date] DESC
) AS eas
OUTER APPLY (
    SELECT TOP 1
        [Value]
        , [Date]
    FROM dbo.[BuildingEvaluations]
    WHERE [BuildingId] = b.[Id]
        AND [Key] = 1 -- Appraised
    ORDER BY [Date] DESC
) AS eap
OUTER APPLY (
    SELECT TOP 1
        [Value]
        , [FiscalYear]
    FROM dbo.[BuildingFiscals]
    WHERE [BuildingId] = b.[Id]
        AND [Key] = 1 -- Estimated
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
