PRINT 'Update Saltspring Island to Salt Spring Island'

UPDATE dbo.[AdministrativeAreas]
SET [Name] = 'Salt Spring Island'
WHERE [Name] = 'Saltspring Island'

UPDATE dbo.[Addresses]
SET [AdministrativeArea] = 'Salt Spring Island'
WHERE [AdministrativeArea] = 'Saltspring Island'
