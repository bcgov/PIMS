PRINT 'Updating NotificationTemplates'

-- Replace the instances thats shows sqft with sqM
UPDATE [pims].dbo.[NotificationTemplates]
SET [Body] = REPLACE([Body], 'sqft', 'sqM') 
WHERE Body LIKE '%sqft%'
