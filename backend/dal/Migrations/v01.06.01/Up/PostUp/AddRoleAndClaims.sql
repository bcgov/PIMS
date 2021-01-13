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
        '5C6CEA5B-9B7C-47E8-852C-693E90ED815E',
        'SRES Financial Reporter',
        'The SRES Financial Reporter can view, create, and delete non-final SPL reports.',
        0,
        0,
        0,
        '5C6CEA5B-9B7C-47E8-852C-693E90ED815E'
    );

PRINT 'Adding Claim' 
--Adding new claim for the SRES Financial Manager
INSERT INTO
    dbo.[Claims] ([Id], [Name], [Description], [IsDisabled], [KeycloakRoleId])
VALUES
(
    '81DED21C-ED32-4694-8F33-79EF17833F2B',
    'reports-spl-admin',
    'Ability to view, create, and delete Final reports.',
    0,
    '81DED21C-ED32-4694-8F33-79EF17833F2B' 
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
    '6238c23d-933e-4c4a-954e-48bae3ce2080'     -- SRES Financial Manager
    , '81DED21C-ED32-4694-8F33-79EF17833F2B'   -- reports-spl-admin
),
(
    '5C6CEA5B-9B7C-47E8-852C-693E90ED815E'     -- SRES Financial Reporter
    , '0FBD370D-6CDE-41E7-9039-F05AE60D75DA'   -- reports-spl
),
(
    '090bc341-af0f-45c9-8e0a-6d99024b52c1'     -- SRES Financial Reporter
    , 'E13D1C7D-F350-4AEE-808E-C9603C29479B'   -- reports-view
);