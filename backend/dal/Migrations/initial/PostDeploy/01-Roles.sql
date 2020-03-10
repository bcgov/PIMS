PRINT 'Adding Roles'
INSERT INTO
    dbo.[Roles] (
        [Id],
        [Name],
        [Description],
        [IsDisabled],
        [SortOrder]
    )
VALUES
    (
        '363634a5-9e88-4346-832f-01d8713072e2',
        'system-administrator',
        'System Administrator of the PIMS solution.',
        0,
        0
    ),
    (
        'c3e1dafc-379b-45ce-86e5-babdff3ec5d3',
        'agency-administrator',
        'Agency Administrator of the users agency.',
        0,
        0
    ),
    (
        '5fd96f19-abe1-47e7-8a54-0a707bc3e4a4',
        'real-estate-manager',
        'Real Estate Manager can manage properties within their agencies.',
        0,
        0
    ),
    (
        '254fab4b-85af-4c3b-accf-66be5635ce2c',
        'real-estate-assistant',
        'Real Estate Assistant can manage properties within their agencies.',
        0,
        0
    ),
    (
        '495900b6-4354-46e1-a070-8e80dc9625e0',
        'assistant-deputy-minister',
        'Assistant Deputy Minister can manage properties within their agencies.',
        0,
        0
    ),
    (
        'a961f8c6-c226-4e10-a9a6-a058f6db0458',
        'executive-director',
        'Executive Director can manage properties within their agencies.',
        0,
        0
    )
