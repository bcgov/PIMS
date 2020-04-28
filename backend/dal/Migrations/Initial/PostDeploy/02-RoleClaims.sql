PRINT 'Adding RoleClaims'

INSERT INTO dbo.[RoleClaims]
    (
    [RoleId]
    , [ClaimId]
    )
VALUES
    -- system-administrator
    (
        'bbf27108-a0dc-4782-8025-7af7af711335'
    , '91fc8939-2dea-44a1-bd17-a1c8f0fe5dc1'   -- property-view
),
    (
        'bbf27108-a0dc-4782-8025-7af7af711335'
    , '5fd96f19-abe1-47e7-8a54-0a707bc3e4a4'   -- property-add
),
    (
        'bbf27108-a0dc-4782-8025-7af7af711335'
    , '223664c7-650c-40ac-8581-f40e10064537'   -- property-edit
),
    (
        'bbf27108-a0dc-4782-8025-7af7af711335'
    , '223664c7-650c-40ac-8581-f40e10164537'   -- property-delete
),
    (
        'bbf27108-a0dc-4782-8025-7af7af711335'
    , '4dc0f39a-32f0-43a4-9d90-62fd94f20567'   -- sensitive-view
),
    -- agency-administrator
    (
        '6ae8448d-5f0a-4607-803a-df0bc4efdc0f'
    , '91fc8939-2dea-44a1-bd17-a1c8f0fe5dc1'   -- property-view
),
    (
        '6ae8448d-5f0a-4607-803a-df0bc4efdc0f'
    , '5fd96f19-abe1-47e7-8a54-0a707bc3e4a4'   -- property-add
),
    (
        '6ae8448d-5f0a-4607-803a-df0bc4efdc0f'
    , '223664c7-650c-40ac-8581-f40e10064537'   -- property-edit
),
    (
        '6ae8448d-5f0a-4607-803a-df0bc4efdc0f'
    , '223664c7-650c-40ac-8581-f40e10164537'   -- property-delete
),
    (
        '6ae8448d-5f0a-4607-803a-df0bc4efdc0f'
    , '4dc0f39a-32f0-43a4-9d90-62fd94f20567'   -- sensitive-view
),
    -- real-estate-manager
    (
        'aad8c03d-892c-4cc3-b992-5b41c4f2392c'
    , '91fc8939-2dea-44a1-bd17-a1c8f0fe5dc1'   -- property-view
),
    (
        'aad8c03d-892c-4cc3-b992-5b41c4f2392c'
    , '5fd96f19-abe1-47e7-8a54-0a707bc3e4a4'   -- property-add
),
    (
        'aad8c03d-892c-4cc3-b992-5b41c4f2392c'
    , '223664c7-650c-40ac-8581-f40e10064537'   -- property-edit
),
    (
        'aad8c03d-892c-4cc3-b992-5b41c4f2392c'
    , '41747042-ad4a-4511-858b-67ed70c8e7e9'   -- dispose-request
),
    (
        'aad8c03d-892c-4cc3-b992-5b41c4f2392c'
    , '4dc0f39a-32f0-43a4-9d90-62fd94f20567'   -- sensitive-view
),
    -- real-estate-assistant
    (
        '7a7b2549-ae85-4ad6-a8d3-3a5f8d4f9ca5'
    , '91fc8939-2dea-44a1-bd17-a1c8f0fe5dc1'   -- property-view
),
    (
        '7a7b2549-ae85-4ad6-a8d3-3a5f8d4f9ca5'
    , '5fd96f19-abe1-47e7-8a54-0a707bc3e4a4'   -- property-add
),
    (
        '7a7b2549-ae85-4ad6-a8d3-3a5f8d4f9ca5'
    , '223664c7-650c-40ac-8581-f40e10064537'   -- property-edit
),
    (
        '7a7b2549-ae85-4ad6-a8d3-3a5f8d4f9ca5'
    , '4dc0f39a-32f0-43a4-9d90-62fd94f20567'   -- sensitive-view
),
    -- assistant-deputy-minister
    (
        'fbe5fc86-f69e-4610-a746-0113d29e04cd'
    , '91fc8939-2dea-44a1-bd17-a1c8f0fe5dc1'   -- property-view
),
    (
        'fbe5fc86-f69e-4610-a746-0113d29e04cd'
    , '5fd96f19-abe1-47e7-8a54-0a707bc3e4a4'   -- property-add
),
    (
        'fbe5fc86-f69e-4610-a746-0113d29e04cd'
    , '223664c7-650c-40ac-8581-f40e10064537'   -- property-edit
),
    (
        'fbe5fc86-f69e-4610-a746-0113d29e04cd'
    , 'd11ce982-f22b-4cd2-87d4-87b8f7f9a3c8'   -- dispose-approve
),
    (
        'fbe5fc86-f69e-4610-a746-0113d29e04cd'
    , '4dc0f39a-32f0-43a4-9d90-62fd94f20567'   -- sensitive-view
),
    -- executive-director
    (
        '6cdfeb00-6f67-4457-b46a-85bbbc97066c'
    , '91fc8939-2dea-44a1-bd17-a1c8f0fe5dc1'   -- property-view
),
    (
        '6cdfeb00-6f67-4457-b46a-85bbbc97066c'
    , '5fd96f19-abe1-47e7-8a54-0a707bc3e4a4'   -- property-add
),
    (
        '6cdfeb00-6f67-4457-b46a-85bbbc97066c'
    , '223664c7-650c-40ac-8581-f40e10064537'   -- property-edit
),
    (
        '6cdfeb00-6f67-4457-b46a-85bbbc97066c'
    , 'd11ce982-f22b-4cd2-87d4-87b8f7f9a3c8'   -- dispose-approve
),
    (
        '6cdfeb00-6f67-4457-b46a-85bbbc97066c'
    , '4dc0f39a-32f0-43a4-9d90-62fd94f20567'   -- sensitive-view
),
    -- SRES
    (
        '08c52eec-6917-4512-ac02-7d7ff89ed7a6'
    , '71e74513-a036-4df3-b724-a8c349b7fc28'   -- admin-properties
)
