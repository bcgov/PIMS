PRINT 'Adding Role'

--Adding new role for the SRES Financial Reporter
INSERT INTO
    dbo.[Roles] (
        [Id],
        [Name],
        [Description],
        [IsPublic],
        [IsDisabled],
        [SortOrder],
        [KeycloakGroupId]
    )
VALUES
    (
        '5c6cea5b-9b7c-47e8-852c-693e90ed815e',
        'SRES Financial Reporter',
        'The SRES Financial Reporter can view, create, and delete non-final SPL reports.',
        0,
        0,
        0,
        '5c6cea5b-9b7c-47e8-852c-693e90ed815e'
    );

PRINT 'Adding Claim'

--Adding new claim for the SRES Financial Manager
INSERT INTO
    dbo.[Claims] ([Id], [Name], [Description], [IsDisabled], [KeycloakRoleId])
VALUES
(
    '81ded21c-ed32-4694-8f33-79ef17833f2b',
    'reports-spl-admin',
    'Ability to view, create, and delete Final reports.',
    0,
    '81ded21c-ed32-4694-8f33-79ef17833f2b'
);

PRINT 'Adding RoleClaims'

--Adding mapping for the new reports-spl-admin claim to the SRES Financial Manager
INSERT INTO dbo.[RoleClaims]
    (
    [RoleId]
    , [ClaimId]
    )
VALUES
(
    'd416f362-1e6f-4e24-a561-c6bb45a35194'     -- SRES Financial Manager
    , '81ded21c-ed32-4694-8f33-79ef17833f2b'   -- reports-spl-admin
),
(
    '5c6cea5b-9b7c-47e8-852c-693e90ed815e'     -- SRES Financial Reporter
    , '0fbd370d-6cde-41e7-9039-f05ae60d75da'   -- reports-spl
),
(
    '5c6cea5b-9b7c-47e8-852c-693e90ed815e'     -- SRES Financial Reporter
    , 'e13d1c7d-f350-4aee-808e-c9603c29479b'   -- reports-view
);
