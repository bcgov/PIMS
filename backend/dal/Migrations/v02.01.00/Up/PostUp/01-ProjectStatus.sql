PRINT 'Updating ProjectStatus'

UPDATE [pims].[dbo].[ProjectStatus]
SET Description = REPLACE(Description, 'Surplus Property Program', 'Surplus Properties Program')
WHERE Description LIKE '%Surplus Property Program%'
AND IsMilestone = 1 