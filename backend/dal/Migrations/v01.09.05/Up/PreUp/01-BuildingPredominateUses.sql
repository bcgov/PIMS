PRINT 'Update Building Predominate Uses'

DECLARE @correctPredominateUseId int;
DECLARE @incorrectPredominateUseId int;

-- Update buildings using wrong predominate use before deleting
SELECT @correctPredominateUseId = [Id] FROM dbo.[BuildingPredominateUses] where Name = 'Senior Housing (Assisted Living / Skilled Nursing)';
SELECT @incorrectPredominateUseId = [Id] FROM dbo.[BuildingPredominateUses] where Name = 'Senior Housing (Assisted Living/Skilled Nursing)';
UPDATE dbo.[Buildings]
SET [BuildingPredominateUseId] = @correctPredominateUseId
WHERE BuildingPredominateUseId = @incorrectPredominateUseId;

SELECT @correctPredominateUseId = [Id] FROM dbo.[BuildingPredominateUses] where Name = 'Training Centre';
SELECT @incorrectPredominateUseId = [Id] FROM dbo.[BuildingPredominateUses] where Name = 'Training Center';
UPDATE dbo.[Buildings]
SET [BuildingPredominateUseId] = @correctPredominateUseId
WHERE BuildingPredominateUseId = @incorrectPredominateUseId;

SELECT @correctPredominateUseId = [Id] FROM dbo.[BuildingPredominateUses] where Name = 'Transportation (Airport / Rail / Bus station)';
SELECT @incorrectPredominateUseId = [Id] FROM dbo.[BuildingPredominateUses] where Name = 'Transportation (Airport/Rail/Bus station)';
update dbo.[Buildings]
SET [BuildingPredominateUseId] = @correctPredominateUseId
WHERE BuildingPredominateUseId = @incorrectPredominateUseId;

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
