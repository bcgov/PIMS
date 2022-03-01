PRINT 'Updating NotificationTemplates'

-- Replace the instances thats shows sqft with Sq. M
UPDATE [pims].dbo.[NotificationTemplates]
SET [Body] = REPLACE([Body], 'sqft', 'Sq. M') 
WHERE Body LIKE '%sqft%';

