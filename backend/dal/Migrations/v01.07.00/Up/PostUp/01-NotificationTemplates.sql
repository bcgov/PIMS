PRINT 'Update e-mail notification templates'

-- Add SRES to BCC except for new disposal submitted as they are already included
UPDATE dbo.[NotificationTemplates]
SET [Bcc] = 'RealPropertyDivision.Disposals@gov.bc.ca'
WHERE [Id] <> 1
