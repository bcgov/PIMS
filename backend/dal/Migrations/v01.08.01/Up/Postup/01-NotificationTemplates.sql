PRINT 'Update NotificationTemplates'

-- Add a default if the address to is null.
UPDATE dbo.[NotificationTemplates]
SET [Body] = REPLACE([Body], '<p>Good afternoon,</p>', '<p>@(Model.ToAgency.AddressTo ?? "Good morning / Good afternoon"),</p>')
WHERE [Id] != 1

-- Add a default if the address to is null.
UPDATE dbo.[NotificationTemplates]
SET [Body] = REPLACE([Body], '<p>Dear @Model.ToAgency.AddressTo,</p>', '<p>@(Model.ToAgency.AddressTo ?? "Good morning / Good afternoon"),</p>')

-- Default all emails addressed to.
UPDATE dbo.[Agencies]
SET [AddressTo] = 'Good morning / Good afternoon'

