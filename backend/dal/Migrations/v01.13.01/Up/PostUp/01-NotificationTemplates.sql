PRINT 'Updating NotificationTemplates'

-- Include the CITZ_RPD_IMIT_HELP@gov.bc.ca email to the Access Request notification
UPDATE dbo.[NotificationTemplates]
SET [To] = 'CITZ_RPD_IMIT_HELP@gov.bc.ca'
WHERE [Id] = 15 and [Name] = 'Access Request'