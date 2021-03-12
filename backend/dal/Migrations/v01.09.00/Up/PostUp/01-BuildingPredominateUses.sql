PRINT 'Update Building Predominate Uses'

-- Update buildings using wrong predominate use before deleting
UPDATE dbo.[Buildings]
SET [BuildingPredominateUseId] = (SELECT [Id] FROM dbo.[BuildingPredominateUses] WHERE Name = 'Senior Housing (Assisted Living / Skilled Nursing)')
WHERE [BuildingPredominateUseId] = (SELECT [Id] FROM dbo.[BuildingPredominateUses] WHERE Name = 'Senior Housing (Assisted Living/Skilled Nursing)');

UPDATE dbo.[Buildings]
SET [BuildingPredominateUseId] = (SELECT [Id] FROM dbo.[BuildingPredominateUses] WHERE Name = 'Training Centre')
WHERE [BuildingPredominateUseId] = (SELECT [Id] FROM dbo.[BuildingPredominateUses] where Name = 'Training Center');

UPDATE dbo.[Buildings]
SET [BuildingPredominateUseId] = (SELECT [Id] FROM dbo.[BuildingPredominateUses] WHERE Name = 'Transportation (Airport / Rail / Bus station)')
WHERE [BuildingPredominateUseId] = (SELECT [Id] FROM dbo.[BuildingPredominateUses] WHERE Name = 'Transportation (Airport/Rail/Bus station)');

-- Update formatting (non-duplicates)
UPDATE dbo.[BuildingPredominateUses]
SET [Name] = 'University / College'
WHERE [Name] = 'University/College'

UPDATE dbo.[BuildingPredominateUses]
SET [Name] = 'Jail / Prison'
WHERE [Name] = 'Jail/Prison'

UPDATE dbo.[BuildingPredominateUses]
SET [Name] = 'Community / Recreation Centre'
WHERE [Name] = 'Community/Recreation Centre'

UPDATE dbo.[BuildingPredominateUses]
SET [Name] = 'Dormitory / Residence Halls'
WHERE [Name] = 'Dormitory/Residence Halls'

-- Delete duplicates after correcting
DELETE FROM dbo.[BuildingPredominateUses]
WHERE [Name] = 'Senior Housing (Assisted Living/Skilled Nursing)'

DELETE FROM dbo.[BuildingPredominateUses]
WHERE [Name] = 'Training Center'

DELETE FROM dbo.[BuildingPredominateUses]
WHERE [Name] = 'Transportation (Airport/Rail/Bus station)'
