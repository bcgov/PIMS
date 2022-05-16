PRINT 'Updating NotificationTemplates'

-- Replace the instances thats shows Yvonne Deibert with Chris Seltenrich
UPDATE [pims].dbo.[NotificationTemplates]
SET [Body] = REPLACE([Body], 'Yvonne Deibert, Executive Director of the Strategic Real Estate Services Branch at 250-387-6348', 'Chris Seltenrich A/Executive Director of the Strategic Real Estate Services Branch at 778-698-3195')
WHERE [Body] LIKE '%Yvonne Deibert, Executive Director of the Strategic Real Estate Services Branch at 250-387-6348%';


