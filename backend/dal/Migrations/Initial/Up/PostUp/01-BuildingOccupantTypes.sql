PRINT 'Adding BuildingOccupantTypes'

INSERT INTO dbo.[BuildingOccupantTypes] (
    [Id]
    , [Name]
    , [IsDisabled]
) VALUES (
    0
    , 'Leased'
    , 0
), (
    1
    , 'Occupied By Owning Ministry'
    , 0
), (
    2
    , 'Unoccupied'
    , 0
)
