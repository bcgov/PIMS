PRINT 'Adding ProjectStatus'

SET IDENTITY_INSERT dbo.[ProjectStatus] ON

INSERT INTO dbo.[ProjectStatus] (
    [Id]
    , [SortOrder]
    , [Name]
    , [GroupName]
    , [Code]
    , [IsTerminal]
    , [IsDisabled]
    , [Description]
    , [Route]
    , [IsMilestone]
) VALUES
-- SPL process
(
    43
    , 20
    , 'Contract in Place - Unconditional'
    , 'Contract in Place'
    , 'SPL-CIP-U'
    , 0
    , 0
    , 'The project has received an unconditional offer.'
    , '/projects/contractinplace'
    , 0
)

SET IDENTITY_INSERT dbo.[ProjectStatus] OFF

UPDATE dbo.[ProjectStatus]
SET
    [Name] = 'Contract in Place - Conditional'
    , [Code] = 'SPL-CIP-C'
    , [Description] = 'The project has received a conditional offer.'
WHERE [Id] = 42
