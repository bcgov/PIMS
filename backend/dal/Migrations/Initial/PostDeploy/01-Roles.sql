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
        'bbf27108-a0dc-4782-8025-7af7af711335',
        'System Administrator',
        'System Administrator of the PIMS solution.',
        0,
        0,
        0
    ),
    (
        '6ae8448d-5f0a-4607-803a-df0bc4efdc0f',
        'Agency Administrator',
        'Agency Administrator of the users agency.',
        0,
        0,
        0
    ),
    (
        'aad8c03d-892c-4cc3-b992-5b41c4f2392c',
        'Real Estate Manager',
        'Real Estate Manager can manage properties within their agencies.',
        1,
        0,
        0
    ),
    (
        '7a7b2549-ae85-4ad6-a8d3-3a5f8d4f9ca5',
        'Real Estate Analyst',
        'Real Estate Analyst can manage properties within their agencies.',
        1,
        0,
        0
    ),
    (
        'fbe5fc86-f69e-4610-a746-0113d29e04cd',
        'Assistant Deputy Minister',
        'Assistant Deputy Minister can manage properties within their agencies.',
        1,
        0,
        0
    ),
    (
        'c9fb2167-d675-455f-96ff-fb0c416246aa',
        'Assistant Deputy Minister Assistant',
        'Assistant Deputy Minister Assistant can manage properties within their agencies.',
        1,
        0,
        0
    ),
    (
        '6cdfeb00-6f67-4457-b46a-85bbbc97066c',
        'Executive Director',
        'Executive Director can manage properties within their agencies.',
        1,
        0,
        0
    ),
    (
        '08c52eec-6917-4512-ac02-7d7ff89ed7a6',
        'SRES',
        'SRES group provides a way to add additional claims to users (i.e. property-delete).',
        0,
        0,
        0
    )
