PRINT 'Delete UBC Buildings'

DECLARE @UBCId INT = (
            SELECT [Id]
            FROM dbo.[Agencies]
            WHERE [Code] = 'UBC'
        )

IF (@UBCId IS NOT NULL)
BEGIN
    DELETE FROM dbo.[ProjectProperties]
    WHERE [BuildingId] IN (
        SELECT [Id]
        FROM dbo.[Buildings]
        WHERE [AgencyId] = @UBCId
    )

    DELETE FROM dbo.[BuildingEvaluations]
    WHERE [BuildingId] IN (
        SELECT [Id]
        FROM dbo.[Buildings]
        WHERE [AgencyId] = @UBCId
    )

    DELETE FROM dbo.[BuildingFiscals]
    WHERE [BuildingId] IN (
        SELECT [Id]
        FROM dbo.[Buildings]
        WHERE [AgencyId] = @UBCId
    )

    DELETE FROM dbo.[ParcelBuildings]
    WHERE [BuildingId] IN (
        SELECT [Id]
        FROM dbo.[Buildings]
        WHERE [AgencyId] = @UBCId
    )

    DELETE FROM dbo.[Buildings]
    WHERE [AgencyId] = @UBCId
END
