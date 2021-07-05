PRINT N'Update [NotificationTemplates]'

UPDATE dbo.[NotificationTemplates]
SET [Audience] = 'OwningAgency'
WHERE [Id] IN (2, 3, 4)
