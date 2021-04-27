PRINT 'Updating NotificationTemplates'

-- Replace the code which is causing a syntax related error during compilation of the template
UPDATE dbo.[NotificationTemplates]
SET [Body] = REPLACE([Body], '(Model.ToAgency.AddressTo ?? "Good morning / @(Model.ToAgency.AddressTo ?? "Good morning / Good afternoon")")', '(Model.ToAgency.AddressTo ?? "Good morning / Good afternoon")') 
WHERE Body LIKE '%@(Model.ToAgency.AddressTo ?? "Good morning / @(Model.ToAgency.AddressTo ?? "Good morning / Good afternoon")")%'