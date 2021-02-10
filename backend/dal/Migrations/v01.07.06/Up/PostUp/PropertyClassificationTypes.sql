PRINT 'Adding Subdivided/Demolished classifications'

INSERT INTO dbo.[PropertyClassifications] (
    [Id]
    , [Name]
    , [IsDisabled]
    , [IsVisible]
    , [SortOrder]
) VALUES (
    5
    , 'Demolished'
    , 0
    , 1
    , 6
), (
    6
    , 'Subdivided'
    , 0
    , 1
    , 7
)
