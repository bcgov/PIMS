PRINT 'Updating NotificationTemplates'

-- Replace the instances thats shows Chris Seltenrich with Yvonne Deibert
UPDATE [pims].dbo.[NotificationTemplates]
SET [Body] = REPLACE([Body],'Chris Seltenrich A/Executive Director of the Strategic Real Estate Services Branch at 778-698-3195', 'Yvonne Deibert, Executive Director of the Strategic Real Estate Services Branch at 250-387-6348')
WHERE [Body] LIKE '%Chris Seltenrich A/Executive Director of the Strategic Real Estate Services Branch at 778-698-3195%';
