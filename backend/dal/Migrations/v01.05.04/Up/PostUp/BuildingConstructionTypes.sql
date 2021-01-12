PRINT 'Update Building Construction Types'

-- Switch to proper Id
UPDATE dbo.[Buildings]
SET [BuildingConstructionTypeId] = 1
WHERE [BuildingConstructionTypeId] = 5

-- Delete the duplicate
DELETE FROM dbo.[BuildingConstructionTypes]
    WHERE [Id] = 5;

-- Update to correct spelling
UPDATE dbo.[BuildingConstructionTypes]
SET [Name] = 'Masonry'
WHERE [Id] = 1
