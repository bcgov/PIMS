PRINT 'Delete UBC Parcels'

DECLARE @UBCId INT = (
            SELECT [Id]
            FROM dbo.[Agencies]
            WHERE [Code] = 'UBC'
        )

IF (@UBCId IS NOT NULL)
BEGIN
    DELETE FROM dbo.[ProjectProperties]
    WHERE [ParcelId] IN (
        SELECT [Id]
        FROM dbo.[Parcels]
        WHERE [AgencyId] = @UBCId
    )

    DELETE FROM dbo.[ParcelEvaluations]
    WHERE [ParcelId] IN (
        SELECT [Id]
        FROM dbo.[Parcels]
        WHERE [AgencyId] = @UBCId
    )

    DELETE FROM dbo.[ParcelFiscals]
    WHERE [ParcelId] IN (
        SELECT [Id]
        FROM dbo.[Parcels]
        WHERE [AgencyId] = @UBCId
    )

    DELETE FROM dbo.[ParcelBuildings]
    WHERE [ParcelId] IN (
        SELECT [Id]
        FROM dbo.[Parcels]
        WHERE [AgencyId] = @UBCId
    )

    DELETE FROM dbo.[Parcels]
    WHERE [AgencyId] = @UBCId
END
