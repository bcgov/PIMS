PRINT 'Adding NotificationTemplates'

SET IDENTITY_INSERT dbo.[NotificationTemplates] ON

INSERT INTO dbo.[NotificationTemplates] (
    [Id]
    , [Name]
    , [Description]
    , [IsDisabled]
    , [To]
    , [Cc]
    , [Bcc]
    , [Audience]
    , [Encoding]
    , [BodyType]
    , [Priority]
    , [Subject]
    , [Body]
    , [Tag]
) VALUES (
    17
    , 'Access Request RPD Mailbox'
    , 'A new authenticated user has requested access.'
    , 0
    , 'CITZ_RPD_IMIT_HELP@gov.bc.ca'
    , ''
    , ''
    , 'Default'
    , 'Utf8'
    , 'Html'
    , 'High'
    , 'PIMS - Access Request'
    , '
<html><head><title>@Model.Environment.Title</title></head>
<body><p>Dear Administrator,</p><p>@Model.AccessRequest.User.FirstName @Model.AccessRequest.User.LastName has submitted an access request to <a href="@Model.Environment.Uri">PIMS</a>.</p><p>Signin and review their request.</p></body></html>'
    , 'Access Request'
)