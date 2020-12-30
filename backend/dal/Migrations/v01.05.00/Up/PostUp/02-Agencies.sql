PRINT 'Update Agencies'

-- Merge LNG, Crown Land Opportunities

DECLARE @rID INT;
SET @rID = (SELECT TOP 1 Id FROM dbo.[Agencies] WHERE [Code] = 'LCLOAR');
DECLARE @aID INT;
SET @aID = (SELECT TOP 1 Id FROM dbo.[Agencies] WHERE [Code] = 'CLO');

IF (@rID > 0)
BEGIN
    -- Transfer any users to the correct agency.
    -- Regrettably their Keycloak account will need to be updated manually.
    UPDATE dbo.[UserAgencies]
    SET [AgencyId] = @aID
    WHERE [AgencyId] = @rID;

    UPDATE dbo.[AccessRequestAgencies]
    SET [AgencyId] = @aID
    WHERE [AgencyId] = @rID;

    -- Transfer all properties.
    UPDATE dbo.[Parcels]
    SET [AgencyId] = @aID
    WHERE [AgencyId] = @rID;

    UPDATE dbo.[Buildings]
    SET [AgencyId] = @aID
    WHERE [AgencyId] = @rID;

    UPDATE dbo.[Projects]
    SET [AgencyId] = @aID
    WHERE [AgencyId] = @rID;

    UPDATE dbo.[ProjectAgencyResponses]
    SET [AgencyId] = @aID
    WHERE [AgencyId] = @rID;

    -- Delete the invalid agency
    DELETE FROM dbo.[Agencies]
    WHERE [Id] = @rID;
END
