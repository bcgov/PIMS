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
(
    'bbf27108-a0dc-4782-8025-7af7af711335'
    , 'fd86ddec-8f9d-4d7b-8c69-956062c5104f'   -- admin-users
),
(
    'bbf27108-a0dc-4782-8025-7af7af711335'
    , '321e245b-ee7d-4d7c-83a8-56b5a9d33c2d'   -- admin-roles
),
(
    'bbf27108-a0dc-4782-8025-7af7af711335'
    , '71e74513-a036-4df3-b724-a8c349b7fc28'   -- admin-properties
),
(
    'bbf27108-a0dc-4782-8025-7af7af711335'
    , '9b556b3f-441f-4d11-9f6f-14d455df4e05'   -- admin-agencies
),
(
    'bbf27108-a0dc-4782-8025-7af7af711335'
    , 'c46ccf94-4b3c-486f-b34c-9a707a54f357'   -- admin-projects
),
(
    'bbf27108-a0dc-4782-8025-7af7af711335'
    , '9e578c1f-1c60-4a5f-98b5-966b079a35e9'   -- project-view
),
(
    'bbf27108-a0dc-4782-8025-7af7af711335'
    , 'cbf68973-e239-41a9-be27-bf0ede3bf335'   -- project-add
),
(
    'bbf27108-a0dc-4782-8025-7af7af711335'
    , 'dbe02a47-34ec-48f9-9df5-3d959c46e174'   -- project-edit
),
(
    'bbf27108-a0dc-4782-8025-7af7af711335'
    , 'd6e91b9c-9728-4e62-8d91-319af2701b9b'   -- project-delete
),
(
    'bbf27108-a0dc-4782-8025-7af7af711335'
    , 'b9e1e966-d2aa-420f-83c4-617b984d1268'   -- system-administrator
),
(
    'bbf27108-a0dc-4782-8025-7af7af711335'
    , '6efd16d4-41ca-4feb-86f5-7598691f7bc6'   -- agency-administrator
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
    , '4dc0f39a-32f0-43a4-9d90-62fd94f20567'   -- sensitive-view
),
(
    '6ae8448d-5f0a-4607-803a-df0bc4efdc0f'
    , 'fd86ddec-8f9d-4d7b-8c69-956062c5104f'   -- admin-users
),
(
    '6ae8448d-5f0a-4607-803a-df0bc4efdc0f'
    , '9e578c1f-1c60-4a5f-98b5-966b079a35e9'   -- project-view
),
(
    '6ae8448d-5f0a-4607-803a-df0bc4efdc0f'
    , 'cbf68973-e239-41a9-be27-bf0ede3bf335'   -- project-add
),
(
    '6ae8448d-5f0a-4607-803a-df0bc4efdc0f'
    , 'dbe02a47-34ec-48f9-9df5-3d959c46e174'   -- project-edit
),
(
    '6ae8448d-5f0a-4607-803a-df0bc4efdc0f'
    , 'd6e91b9c-9728-4e62-8d91-319af2701b9b'   -- project-delete
),
(
    '6ae8448d-5f0a-4607-803a-df0bc4efdc0f'
    , '6efd16d4-41ca-4feb-86f5-7598691f7bc6'   -- agency-administrator
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
(
    'aad8c03d-892c-4cc3-b992-5b41c4f2392c'
    , '9e578c1f-1c60-4a5f-98b5-966b079a35e9'   -- project-view
),
(
    'aad8c03d-892c-4cc3-b992-5b41c4f2392c'
    , 'cbf68973-e239-41a9-be27-bf0ede3bf335'   -- project-add
),
(
    'aad8c03d-892c-4cc3-b992-5b41c4f2392c'
    , 'dbe02a47-34ec-48f9-9df5-3d959c46e174'   -- project-edit
),
(
    'aad8c03d-892c-4cc3-b992-5b41c4f2392c'
    , 'd6e91b9c-9728-4e62-8d91-319af2701b9b'   -- project-delete
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
(
    '7a7b2549-ae85-4ad6-a8d3-3a5f8d4f9ca5'
    , '9e578c1f-1c60-4a5f-98b5-966b079a35e9'   -- project-view
),
(
    '7a7b2549-ae85-4ad6-a8d3-3a5f8d4f9ca5'
    , 'cbf68973-e239-41a9-be27-bf0ede3bf335'   -- project-add
),
(
    '7a7b2549-ae85-4ad6-a8d3-3a5f8d4f9ca5'
    , 'dbe02a47-34ec-48f9-9df5-3d959c46e174'   -- project-edit
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
    , '4dc0f39a-32f0-43a4-9d90-62fd94f20567'   -- sensitive-view
),
(
    'fbe5fc86-f69e-4610-a746-0113d29e04cd'
    , '9e578c1f-1c60-4a5f-98b5-966b079a35e9'   -- project-view
),
(
    'fbe5fc86-f69e-4610-a746-0113d29e04cd'
    , 'cbf68973-e239-41a9-be27-bf0ede3bf335'   -- project-add
),
(
    'fbe5fc86-f69e-4610-a746-0113d29e04cd'
    , 'dbe02a47-34ec-48f9-9df5-3d959c46e174'   -- project-edit
),
(
    'fbe5fc86-f69e-4610-a746-0113d29e04cd'
    , 'd6e91b9c-9728-4e62-8d91-319af2701b9b'   -- project-delete
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
    , '4dc0f39a-32f0-43a4-9d90-62fd94f20567'   -- sensitive-view
),
(
    '6cdfeb00-6f67-4457-b46a-85bbbc97066c'
    , '9e578c1f-1c60-4a5f-98b5-966b079a35e9'   -- project-view
),
(
    '6cdfeb00-6f67-4457-b46a-85bbbc97066c'
    , 'cbf68973-e239-41a9-be27-bf0ede3bf335'   -- project-add
),
(
    '6cdfeb00-6f67-4457-b46a-85bbbc97066c'
    , 'dbe02a47-34ec-48f9-9df5-3d959c46e174'   -- project-edit
),
(
    '6cdfeb00-6f67-4457-b46a-85bbbc97066c'
    , 'd6e91b9c-9728-4e62-8d91-319af2701b9b'   -- project-delete
),
    -- SRES
(
    '08c52eec-6917-4512-ac02-7d7ff89ed7a6'
    , '71e74513-a036-4df3-b724-a8c349b7fc28'   -- admin-properties
),
(
    '08c52eec-6917-4512-ac02-7d7ff89ed7a6'
    , '223664c7-650c-40ac-8581-f40e10164537'   -- property-delete
),
(
    '08c52eec-6917-4512-ac02-7d7ff89ed7a6'
    , 'd6e91b9c-9728-4e62-8d91-319af2701b9b'   -- project-delete
),
(
    '08c52eec-6917-4512-ac02-7d7ff89ed7a6'
    , 'c46ccf94-4b3c-486f-b34c-9a707a54f357'   -- admin-projects
),
(
    '08c52eec-6917-4512-ac02-7d7ff89ed7a6'
    , 'd11ce982-f22b-4cd2-87d4-87b8f7f9a3c8'   -- dispose-approve
)
