PRINT N'Update [NotificationTemplates]'

UPDATE dbo.[NotificationTemplates]
SET [Audience] = N'ProjectOwner'
WHERE [Id] IN (6, 7, 8)
