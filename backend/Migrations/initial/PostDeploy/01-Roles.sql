PRINT 'Adding Roles'

INSERT INTO dbo.[Roles] (
    [Id]
    , [Name]
    , [Description]
    , [IsDisabled]
) VALUES (
    '91fc8939-2dea-44a1-bd17-a1c8f0fe5dc1'
    , 'administrator'
    , 'Administrator of the PIMS solution.'
    , 0
), (
    '5fd96f19-abe1-47e7-8a54-0a707bc3e4a4'
    , 'real-estate-manager'
    , 'Real Estate Manager can manage properties within their agencies.'
    , 0
)
