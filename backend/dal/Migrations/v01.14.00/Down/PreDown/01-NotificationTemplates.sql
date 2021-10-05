PRINT 'Updating NotificationTemplates'

-- to remove the project numbers from ERP templates
UPDATE dbo.[NotificationTemplates]
SET [Body] = REPLACE([Body], '<p><b> @Model.Project.ProjectNumber : </b></p>', '') 
WHERE Body LIKE '%<p><b> @Model.Project.ProjectNumber : </b></p>%' AND [Id] IN (5,6,7,8,9,10,11,12,13,14);

UPDATE dbo.[NotificationTemplates]
SET [Subject] = N'ACTION REQUIRED - Notification of Surplus Real Property'
WHERE [Id] = 5;

-- setting column back to 200
ALTER TABLE dbo.[NotificationTemplates]
ALTER COLUMN
    [Subject] NVARCHAR(200) NOT NULL;
