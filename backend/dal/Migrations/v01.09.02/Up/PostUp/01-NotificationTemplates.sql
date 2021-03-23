PRINT 'Updating NotificationTemplates - Remove CC'

UPDATE dbo.[NotificationTemplates]
SET [Cc] = REPLACE([Cc], 'Deibert, Yvonne CITZ:EX <Yvonne.Deibert@gov.bc.ca>; Uppal, Sanjay CITZ:EX <Sanjay.Uppal@gov.bc.ca>; Miller, Lauren CITZ:EX <Lauren.Miller@gov.bc.ca>', '')
