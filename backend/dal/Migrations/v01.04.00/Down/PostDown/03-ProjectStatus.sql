PRINT 'Removing ProjectStatus'

UPDATE dbo.[ProjectStatus]
SET
    [Name] = 'Contract in Place'
    , [Code] = 'SPL-CIP'
    , [Description] = 'The project has received a conditional or unconditional offer.'
WHERE [Id] = 42

-- Move projects back to the original Contract in Place
UPDATE dbo.[Projects]
SET [StatusId] = 42
WHERE [StatusId] = 43

DELETE FROM dbo.[ProjectStatus]
WHERE [Id] = 43
