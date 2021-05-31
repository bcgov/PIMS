PRINT 'Updating TRAN Agencies'

-- These are the ministry and agencies from Ministry of Transportation & Infrastructure
DECLARE @TRAN INT = (SELECT TOP 1 [Id] FROM dbo.[Agencies] WHERE [Code] = 'TRAN')
DECLARE @BCTFA INT = (SELECT TOP 1 [Id] FROM dbo.[Agencies] WHERE [Code] = 'BCTFA')
DECLARE @BCT INT = (SELECT TOP 1 [Id] FROM dbo.[Agencies] WHERE [Code] = 'BCT')

-- The following agencies need to be removed
DECLARE @PLMB INT = (SELECT TOP 1 [Id] FROM dbo.[Agencies] WHERE [Code] = 'PLMB')
DECLARE @TIC INT = (SELECT TOP 1 [Id] FROM dbo.[Agencies] WHERE [Code] = 'TIC')

-- Move users from sub-agencies to the ministry
-- This will also require Keycloak user agencies claim to be manually updated
-- Get the new agencies claim value with this query:
--    (SELECT STRING_AGG([Id], ',') FROM dbo.[Agencies] WHERE [Code] IN ('TRAN', 'BCTFA', 'BCT'))
-- This returns currently in production the following value '9,131,132'
-- Now get the users that will need to be updated with the above value with this query:
--    (SELECT ua.[UserId], u.[Username], u.[Email] FROM dbo.[UserAgencies] ua JOIN dbo.[Users] u ON ua.[UserId] = u.[Id] WHERE ua.[AgencyId] IN (@BCTFA, @BCT, @PLMB, @TIC))
-- This returns currently in production the following users 'cedison@idir, dluison@idir, rstoyko@bceid, kevhouse@idir'
-- To update keycloak you will need to manually update each user's "agencies" claim.
-- You can do this either by editing the user within PIMS User Management, or the Keycloak Realm GUI.

-- Temporarily save all TRAN users
SELECT DISTINCT [UserId]
INTO #TRANUsers
FROM dbo.[UserAgencies]
WHERE [AgencyId] IN (@TRAN, @BCTFA, @PLMB, @TIC, @BCT)

-- Remove TRAN users agencies
DELETE FROM dbo.[UserAgencies]
WHERE [UserId] IN (SELECT [UserId] FROM #TRANUsers)

-- Re-add all TRAN users
INSERT INTO dbo.[UserAgencies] (
    [UserId]
    , [AgencyId]
)
SELECT [UserId], @TRAN
FROM #TRANUsers

-- Remove temp table.
DROP TABLE #TRANUsers

-- Move properties to BCTFA
UPDATE dbo.[Parcels]
SET [AgencyId] = @BCTFA
WHERE [AgencyId] IN (@TRAN, @PLMB, @TIC, @BCT)

-- Move properties to BCTFA
UPDATE dbo.[Buildings]
SET [AgencyId] = @BCTFA
WHERE [AgencyId] IN (@TRAN, @PLMB, @TIC, @BCT)

-- Move projects to BCTFA
UPDATE dbo.[Projects]
SET [AgencyId] = @BCTFA
WHERE [AgencyId] IN (@TRAN, @PLMB, @TIC, @BCT)

-- Update any access request to use the ministry instead of the agency
-- Since PIMS currently only supports a single agency to be selected when submitting access requests, this should be fine.
UPDATE dbo.[AccessRequestAgencies]
SET [AgencyId] = @TRAN
WHERE [AgencyId] IN  (@BCTFA, @PLMB, @TIC, @BCT)

-- There are no relevant agency responses in production, but in any of the test dbs they need to be cleared
DELETE FROM dbo.[ProjectAgencyResponses]
WHERE [AgencyId] IN (@PLMB, @TIC)

-- Transfer any notifications to the ministry
-- There are no relevant notifications in the queue in production, but in any of the test dbs they need to be cleared
UPDATE dbo.[NotificationQueue]
SET [ToAgencyId] = @TRAN
WHERE [ToAgencyId] IN (@BCTFA, @PLMB, @TIC, @BCT)

-- Delete the invalid agencies
DELETE FROM dbo.[Agencies]
WHERE [Id] IN (@PLMB, @TIC)
