PRINT 'Updating NotificationTemplates'

-- Replace the instances thats shows sqM with sqft
UPDATE [pims].dbo.[NotificationTemplates]
SET [Body] = REPLACE([Body], 'sqM', 'sqft') 
WHERE Body LIKE '%sqM%';
