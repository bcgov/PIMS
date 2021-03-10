PRINT 'Update NotificationTemplates'

UPDATE dbo.[NotificationTemplates]
SET [Body] = REPLACE([Body], '<p>Dear @Model.Project.Manager,</p>', '<p>Dear @(Model.Project.Manager ?? "Property Manager"),</p>')
WHERE [Id] = 16


UPDATE dbo.[NotificationTemplates]
SET [Body] = REPLACE([Body], '<p>Good afternoon,</p>', '<p>Good morning / Good afternoon,</p>')
WHERE [Id] = 1
