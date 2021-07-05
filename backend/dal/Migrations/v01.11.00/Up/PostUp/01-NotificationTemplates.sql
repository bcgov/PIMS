PRINT N'Update [NotificationTemplates]'

UPDATE dbo.[NotificationTemplates]
SET [Audience] = N'ProjectOwner'
WHERE [Id] IN (2, 3, 4)

UPDATE dbo.[NotificationTemplates]
SET [Body] = N'
<html>
<head><title>@Model.Environment.Title</title></head>
<body>
  <p>Good morning / Good afternoon,</p>
  <p>Your project @Model.Project.ProjectNumber has been denied. Signin to <a href="@Model.Environment.Uri">PIMS</a> to review the reason.</p>
  <p>Sincerely Real Property Division</p>
</body>
</html>'
WHERE [Id] = 2

UPDATE dbo.[NotificationTemplates]
SET [Body] = N'
<html><head><title>@Model.Environment.Title</title></head>
<body>
  <p>Good morning / Good afternoon,</p>
  <p>Your project @Model.Project.ProjectNumber has been cancelled. Signin to <a href="@Model.Environment.Uri">PIMS</a> to review the reason.</p>
  <p>Sincerely Real Property Division</p>
</body>
</html>'
WHERE [Id] = 3

UPDATE dbo.[NotificationTemplates]
SET [Body] = N'
@using System.Linq
@using Pims.Dal.Entities
<html>
<head><title>@Model.Environment.Title</title></head>
<body>
  <p>Good morning / Good afternoon,</p>
  <p>Your project @Model.Project.ProjectNumber has been approved. Signin to <a href="@Model.Environment.Uri">PIMS</a> to review the progress.</p>
  <p>@Model.Project.Notes.FirstOrDefault(n => n.NoteType == NoteTypes.ErpNotification)?.Note</p><p>Sincerely Real Property Division</p>
</body>
</html>'
WHERE [Id] = 4
