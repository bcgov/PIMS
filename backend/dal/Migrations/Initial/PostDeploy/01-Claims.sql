PRINT 'Adding Claims'
INSERT INTO
    dbo.[Claims] ([Id], [Name], [Description], [IsDisabled])
VALUES
(
    'fd86ddec-8f9d-4d7b-8c69-956062c5104f',
    'admin-users',
    'Ability to administrate users.',
    0
), (
    '321e245b-ee7d-4d7c-83a8-56b5a9d33c2d',
    'admin-roles',
    'Ability to administrate roles.',
    0
), (
    '71e74513-a036-4df3-b724-a8c349b7fc28',
    'admin-properties',
    'Ability to administrate properties.',
    0
), (
    '9b556b3f-441f-4d11-9f6f-14d455df4e05',
    'admin-agencies',
    'Ability to administrate agencies.',
    0
), (
    'c46ccf94-4b3c-486f-b34c-9a707a54f357',
    'admin-projects',
    'Ability to administrate projects.',
    0
), (
    '91fc8939-2dea-44a1-bd17-a1c8f0fe5dc1',
    'property-view',
    'Ability to view properties.',
    0
), (
    '5fd96f19-abe1-47e7-8a54-0a707bc3e4a4',
    'property-add',
    'Ability to add properties.',
    0
), (
    '223664c7-650c-40ac-8581-f40e10064537',
    'property-edit',
    'Ability to edit properties.',
    0
), (
    '223664c7-650c-40ac-8581-f40e10164537',
    'property-delete',
    'Ability to delete properties.',
    0
), (
    '41747042-ad4a-4511-858b-67ed70c8e7e9',
    'dispose-request',
    'Ability to request to dispose properties.',
    0
), (
    'd11ce982-f22b-4cd2-87d4-87b8f7f9a3c8',
    'dispose-approve',
    'Ability to approve disposal of a properties.',
    0
), (
    '4dc0f39a-32f0-43a4-9d90-62fd94f20567',
    'sensitive-view',
    'Ability to view sensitive properties.',
    0
), (
    '9e578c1f-1c60-4a5f-98b5-966b079a35e9',
    'project-view',
    'Ability to view projects.',
    0
), (
    'cbf68973-e239-41a9-be27-bf0ede3bf335',
    'project-add',
    'Ability to add projects.',
    0
), (
    'dbe02a47-34ec-48f9-9df5-3d959c46e174',
    'project-edit',
    'Ability to edit projects.',
    0
), (
    'd6e91b9c-9728-4e62-8d91-319af2701b9b',
    'project-delete',
    'Ability to delete projects.',
    0
), (
    'b9e1e966-d2aa-420f-83c4-617b984d1268',
    'system-administrator',
    'Ability to administrate system.',
    0
), (
    '6efd16d4-41ca-4feb-86f5-7598691f7bc6',
    'agency-administrator',
    'Ability to administrate agencies.',
    0
)

