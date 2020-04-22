-- This script provides a way to union both parcels and buildings into a single result of properties.
CREATE VIEW View_Properties AS
SELECT
    p.Id
    , PropertyTypeId = 0
    , p.StatusId
    , Status = s.Name
    , p.ClassificationId
    , Classification = c.Name
    , p.AgencyId
    , Agency = a.Name
    , p.AddressId
    , Address = adr.Address1 + ' ' + adr.Address2
    , City = ac.Name
    , Province = ap.Name
    , adr.Postal
    , p.ProjectNumber
    , p.Description
    , p.Latitude
    , p.Longitude
    , p.IsSensitive

    -- Parcel Properties
    , p.PID
    , p.PIN
    , LandArea = p.LandArea
    , LandLegalDescription = p.LandLegalDescription
    , Municipality = p.Municipality
    , Zoning = p.Zoning
    , ZoningPotential = p.ZoningPotential

    -- Building Properties
    , LocalId = null
    , BuildingConstructionTypeId = 0
    , BuildingConstructionType = null
    , BuildingFloorCount = 0
    , BuildingPredominateUseId = 0
    , BuildingPredominateUse = null
    , BuildingOccupantTypeId = 0
    , BuildingOccupantType = null
    , BuildingTenancy = null
    , RentableArea = 0
    , LeaseExpiry = null
    , OccupantName = null
    , TransferLeaseOnSale = CAST(0 AS BIT)

    , Assessed = ISNULL(eas.[Value], 0)
    , AssessedDate = eas.[Date]
    , Appraised = ISNULL(eap.[Value], 0)
    , AppraisedDate = eap.[Date]
    , Estimated = ISNULL(fe.[Value], 0)
    , EstimatedFiscalYear = fe.[FiscalYear]
    , NetBook = ISNULL(fn.[Value], 0)
    , NetBookFiscalYear = fn.[FiscalYear]
FROM dbo.[Parcels] p
JOIN dbo.[PropertyStatus] s ON p.StatusId = s.Id
JOIN dbo.[PropertyClassifications] c ON p.ClassificationId = c.Id
JOIN dbo.[Agencies] a ON p.AgencyId = a.Id
JOIN dbo.[Addresses] adr ON p.AddressId = adr.Id
JOIN dbo.[Cities] ac ON adr.CityId = ac.Id
JOIN dbo.[Provinces] ap ON adr.ProvinceId = ap.Id
OUTER APPLY (
    SELECT TOP 1
        [Value]
        , [Date]
    FROM dbo.[ParcelEvaluations]
    WHERE [ParcelId] = p.Id
        AND [Key] = 0 -- Assessed
    ORDER BY [Date] DESC
) AS eas
OUTER APPLY (
    SELECT TOP 1
        [Value]
        , [Date]
    FROM dbo.[ParcelEvaluations]
    WHERE [ParcelId] = p.Id
        AND [Key] = 1 -- Appraised
    ORDER BY [Date] DESC
) AS eap
OUTER APPLY (
    SELECT TOP 1
        [Value]
        , [FiscalYear]
    FROM dbo.[ParcelFiscals]
    WHERE [ParcelId] = p.Id
        AND [Key] = 1 -- Estimated
    ORDER BY [FiscalYear] DESC
) AS fe
OUTER APPLY (
    SELECT TOP 1
        [Value]
        , [FiscalYear]
    FROM dbo.[ParcelFiscals]
    WHERE [ParcelId] = p.Id
        AND [Key] = 0 -- NetBook
    ORDER BY [FiscalYear] DESC
) AS fn
UNION
SELECT
    b.Id
    , PropertyTypeId = 1
    , b.StatusId
    , Status = s.Name
    , b.ClassificationId
    , Classification = c.Name
    , b.AgencyId
    , Agency = a.Name
    , b.AddressId
    , Address = adr.Address1 + ' ' + adr.Address2
    , City = ac.Name
    , Province = ap.Name
    , adr.Postal
    , b.ProjectNumber
    , b.Description
    , b.Latitude
    , b.Longitude
    , b.IsSensitive

    -- Parcel Properties
    , PID = p.PID
    , PIN = p.PIN
    , LandArea = p.LandArea
    , LandLegalDescription = p.LandLegalDescription
    , Municipality = p.Municipality
    , Zoning = p.Zoning
    , ZoningPotential = p.ZoningPotential

    -- Building Properties
    , LocalId = b.LocalId
    , BuildingConstructionTypeId = b.BuildingConstructionTypeId
    , BuildingConstructionType = bct.Name
    , BuildingFloorCount = b.BuildingFloorCount
    , BuildingPredominateUseId = b.BuildingPredominateUseId
    , BuildingPredominateUse = bpu.Name
    , BuildingOccupantTypeId = b.BuildingOccupantTypeId
    , BuildingOccupantType = bot.Name
    , BuildingTenancy = b.BuildingTenancy
    , RentableArea = b.RentableArea
    , LeaseExpiry = b.LeaseExpiry
    , OccupantName = b.OccupantName
    , TransferLeaseOnSale = b.TransferLeaseOnSale

    , Assessed = ISNULL(eas.[Value], 0)
    , AssessedDate = eas.[Date]
    , Appraised = ISNULL(eap.[Value], 0)
    , AppraisedDate = eap.[Date]
    , Estimated = ISNULL(fe.[Value], 0)
    , EstimatedFiscalYear = fe.[FiscalYear]
    , NetBook = ISNULL(fn.[Value], 0)
    , NetBookFiscalYear = fn.[FiscalYear]
FROM dbo.[Buildings] b
JOIN dbo.[Parcels] p ON b.ParcelId = p.Id
JOIN dbo.[PropertyStatus] s ON b.StatusId = s.Id
JOIN dbo.[PropertyClassifications] c ON b.ClassificationId = c.Id
JOIN dbo.[Agencies] a ON b.AgencyId = a.Id
JOIN dbo.[Addresses] adr ON b.AddressId = adr.Id
JOIN dbo.[Cities] ac ON adr.CityId = ac.Id
JOIN dbo.[Provinces] ap ON adr.ProvinceId = ap.Id
JOIN dbo.[BuildingConstructionTypes] bct ON b.BuildingConstructionTypeId = bct.Id
JOIN dbo.[BuildingOccupantTypes] bot ON b.BuildingOccupantTypeId = bot.Id
JOIN dbo.[BuildingPredominateUses] bpu ON b.BuildingPredominateUseId = bpu.Id
OUTER APPLY (
    SELECT TOP 1
        [Value]
        , [Date]
    FROM dbo.[ParcelEvaluations]
    WHERE [ParcelId] = p.Id
        AND [Key] = 0 -- Assessed
    ORDER BY [Date] DESC
) AS eas
OUTER APPLY (
    SELECT TOP 1
        [Value]
        , [Date]
    FROM dbo.[ParcelEvaluations]
    WHERE [ParcelId] = p.Id
        AND [Key] = 1 -- Appraised
    ORDER BY [Date] DESC
) AS eap
OUTER APPLY (
    SELECT TOP 1
        [Value]
        , [FiscalYear]
    FROM dbo.[ParcelFiscals]
    WHERE [ParcelId] = p.Id
        AND [Key] = 1 -- Estimated
    ORDER BY [FiscalYear] DESC
) AS fe
OUTER APPLY (
    SELECT TOP 1
        [Value]
        , [FiscalYear]
    FROM dbo.[ParcelFiscals]
    WHERE [ParcelId] = p.Id
        AND [Key] = 0 -- NetBook
    ORDER BY [FiscalYear] DESC
) AS fn

