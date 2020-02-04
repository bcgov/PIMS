PRINT 'Adding PropertyClassifications'

INSERT INTO dbo.[PropertyClassifications] (
    [Id]
    , [Name]
    , [IsDisabled]
) VALUES (
    0
    , 'Core Operational'
    , 0
), (
    1
    , 'Core Strategic'
    , 0
), (
    2
    , 'Surplus Active'
    , 0
), (
    3
    , 'Surplus Encumbered'
    , 0
)
