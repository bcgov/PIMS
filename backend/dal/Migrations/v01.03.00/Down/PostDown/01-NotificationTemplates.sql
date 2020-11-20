PRINT 'Updating NotificationTemplates'

UPDATE dbo.[NotificationTemplates]
SET [Body] = '
@using System.Linq
@using Pims.Dal.Entities
<html><head><title>@Model.Environment.Title</title></head>
<body><p>Dear @Model.Project.Manager,</p><p>Your project @Model.Project.ProjectNumber has been updated with the following note;</p><p>@Model.Project.PublicNote</p></body></html>'
WHERE [Id] = 16

