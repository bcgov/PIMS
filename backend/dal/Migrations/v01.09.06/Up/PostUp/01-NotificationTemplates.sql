PRINT 'Update NotificationTemplates'

UPDATE dbo.[NotificationTemplates]
SET [Body] = REPLACE([Body], '@Model.Project.Manager', '@(Model.Project.Manager ?? "Property Manager")')
WHERE [Id] = 16


UPDATE dbo.[NotificationTemplates]
SET [Body] = REPLACE([Body], 'Good afternoon', 'Good morning / Good afternoon')
WHERE [Id] = 1
