-- Remove SRES from BCCs
UPDATE dbo.[NotificationTemplates]
SET [Bcc] = ''
WHERE [Bcc] = 'RealPropertyDivision.Disposals@gov.bc.ca'

