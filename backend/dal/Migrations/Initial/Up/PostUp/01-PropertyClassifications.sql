PRINT 'Adding PropertyClassifications'

INSERT INTO dbo.[PropertyClassifications] (
    [Id]
    , [Name]
    , [IsDisabled]
    , [IsVisible]
    , [SortOrder]
) VALUES (
    0
    , 'Core Operational'
    , 0
    , 1
    , 1
), (
    1
    , 'Core Strategic'
    , 0
    , 1
    , 2
), (
    2
    , 'Surplus Active'
    , 0
    , 1
    , 3
), (
    3
    , 'Surplus Encumbered'
    , 0
    , 1
    , 4
), (
    4
    , 'Disposed'
    , 0
    , 0
    , 5
)
