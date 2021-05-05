PRINT 'Updating NotificationTemplates - Remove CC'

UPDATE dbo.[NotificationTemplates]
SET [Cc] = ''
