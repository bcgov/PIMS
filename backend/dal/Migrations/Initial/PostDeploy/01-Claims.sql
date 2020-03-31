PRINT 'Adding Claims'
INSERT INTO
    dbo.[Claims] ([Id], [Name], [Description], [IsDisabled])
VALUES
    (
        'fd86ddec-8f9d-4d7b-8c69-956062c5104f',
        'admin-users',
        'Ability to administrate users.',
        0
    ),
    (
        '321e245b-ee7d-4d7c-83a8-56b5a9d33c2d',
        'admin-roles',
        'Ability to administrate roles.',
        0
    ),
    (
        '9b556b3f-441f-4d11-9f6f-14d455df4e05',
        'admin-agencies',
        'Ability to administrate agencies.',
        0
    ),
    (
        '91fc8939-2dea-44a1-bd17-a1c8f0fe5dc1',
        'property-view',
        'Ability to view properties.',
        0
    ),
    (
        '5fd96f19-abe1-47e7-8a54-0a707bc3e4a4',
        'property-add',
        'Ability to add properties.',
        0
    ),
    (
        '223664c7-650c-40ac-8581-f40e10064537',
        'property-edit',
        'Ability to edit properties.',
        0
    ),
    (
        '41747042-ad4a-4511-858b-67ed70c8e7e9',
        'dispose-request',
        'Ability to request to dispose properties.',
        0
    ),
    (
        'd11ce982-f22b-4cd2-87d4-87b8f7f9a3c8',
        'dispose-approve',
        'Ability to approve disposal of a properties.',
        0
    ),
    (
        '4dc0f39a-32f0-43a4-9d90-62fd94f20567',
        'sensitive-view',
        'Ability to view sensitive properties.',
        0
    )
