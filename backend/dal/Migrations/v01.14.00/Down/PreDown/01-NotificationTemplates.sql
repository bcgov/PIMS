PRINT 'Updating NotificationTemplates'

-- to remove the project numbers from ERP templates
UPDATE dbo.[NotificationTemplates]
SET [Body] = REPLACE([Body], '<p><b> @Model.Project.ProjectNumber : </b></p>', '') 
WHERE Body LIKE '%<p><b> @Model.Project.ProjectNumber : </b></p>%' AND [Id] IN (5,6,7,8,9,10,11,12,13,14);
