PRINT 'Updating PropertyTypes'

-- Ensure the insert succeeds.
DELETE FROM dbo.[PropertyTypes] where Id = 2;

INSERT INTO dbo.[PropertyTypes] (
    [Id]
    , [Name]
    , [IsDisabled]
) VALUES (
    2
    , 'Subdivision'
    , 0
)
