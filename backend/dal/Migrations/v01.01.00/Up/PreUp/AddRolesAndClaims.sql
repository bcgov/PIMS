INSERT INTO
    dbo.[Claims] ([Id], [Name], [Description], [IsDisabled])
VALUES
(
    '0fbd370d-6cde-41e7-9039-f05ae60d75da',
    'reports-spl',
    'Ability to administrate spl reports.',
    0
), (
    'e13d1c7d-f350-4aee-808e-c9603c29479b',
    'reports-view',
    'Ability to view exported reports.',
    0
);

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
        'd416f362-1e6f-4e24-a561-c6bb45a35194',
        'SRES Financial Manager',
        'SRES Financial Manager has claims specific to administering and viewing reports of financial data.',
        0,
        0,
        0
    );

INSERT INTO dbo.[RoleClaims]
    (
    [RoleId]
    , [ClaimId]
    )
VALUES
(
    'd416f362-1e6f-4e24-a561-c6bb45a35194'
    , '0fbd370d-6cde-41e7-9039-f05ae60d75da'   -- reports-spl
), (
    'd416f362-1e6f-4e24-a561-c6bb45a35194'
    , 'e13d1c7d-f350-4aee-808e-c9603c29479b'   -- reports-view
);
