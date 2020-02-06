PRINT 'Adding PropertyStatus'

INSERT INTO dbo.[PropertyStatus] (
    [Id]
    , [Name]
    , [IsDisabled]
) VALUES (
    0
    , 'Disposed'
    , 0
), (
    1
    , 'Active'
    , 0
)
