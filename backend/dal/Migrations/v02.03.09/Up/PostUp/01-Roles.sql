PRINT 'Adding Roles'
INSERT INTO
    dbo.[Roles] (
        [Id],
        [Name],
        [Description],
        [IsPublic],
        [IsDisabled],
        [SortOrder]
    )
VALUES
    (
        '17bc599d-268f-41d1-b326-6fbbe1a41c9b',
        'View Only Properties',
        'Ability to View all agency properties.',
        0,
        0,
        0
    )
