PRINT 'Update NotificationTemplates'

-- Add a default if the address to is null.
UPDATE dbo.[NotificationTemplates]
SET [Body] = REPLACE([Body], 'Dear @Model.ToAgency.AddressTo', '@(Model.ToAgency.AddressTo ?? "Good Morning")')

-- Default all emails addressed to.
UPDATE dbo.[Agencies]
SET [AddressTo] = 'Good Morning'

