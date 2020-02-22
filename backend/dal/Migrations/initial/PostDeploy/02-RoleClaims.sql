PRINT 'Adding RoleClaims'

INSERT INTO dbo.[RoleClaims]
    (
    [RoleId]
    , [ClaimId]
    )
VALUES
    -- system-administrator
    (
        '363634a5-9e88-4346-832f-01d8713072e2'
    , '91fc8939-2dea-44a1-bd17-a1c8f0fe5dc1'   -- property-view
),
    (
        '363634a5-9e88-4346-832f-01d8713072e2'
    , '5fd96f19-abe1-47e7-8a54-0a707bc3e4a4'   -- property-add
),
    (
        '363634a5-9e88-4346-832f-01d8713072e2'
    , '223664c7-650c-40ac-8581-f40e10064537'   -- property-edit
),
    (
        '363634a5-9e88-4346-832f-01d8713072e2'
    , '4dc0f39a-32f0-43a4-9d90-62fd94f20567'   -- sensitive-view
),
    -- agency-administrator
    (
        'c3e1dafc-379b-45ce-86e5-babdff3ec5d3'
    , '91fc8939-2dea-44a1-bd17-a1c8f0fe5dc1'   -- property-view
),
    (
        'c3e1dafc-379b-45ce-86e5-babdff3ec5d3'
    , '5fd96f19-abe1-47e7-8a54-0a707bc3e4a4'   -- property-add
),
    (
        'c3e1dafc-379b-45ce-86e5-babdff3ec5d3'
    , '223664c7-650c-40ac-8581-f40e10064537'   -- property-edit
),
    (
        'c3e1dafc-379b-45ce-86e5-babdff3ec5d3'
    , '4dc0f39a-32f0-43a4-9d90-62fd94f20567'   -- sensitive-view
),
    -- real-estate-manager
    (
        '5fd96f19-abe1-47e7-8a54-0a707bc3e4a4'
    , '91fc8939-2dea-44a1-bd17-a1c8f0fe5dc1'   -- property-view
),
    (
        '5fd96f19-abe1-47e7-8a54-0a707bc3e4a4'
    , '5fd96f19-abe1-47e7-8a54-0a707bc3e4a4'   -- property-add
),
    (
        '5fd96f19-abe1-47e7-8a54-0a707bc3e4a4'
    , '223664c7-650c-40ac-8581-f40e10064537'   -- property-edit
),
    (
        '5fd96f19-abe1-47e7-8a54-0a707bc3e4a4'
    , '41747042-ad4a-4511-858b-67ed70c8e7e9'   -- dispose-request
),
    (
        '5fd96f19-abe1-47e7-8a54-0a707bc3e4a4'
    , '4dc0f39a-32f0-43a4-9d90-62fd94f20567'   -- sensitive-view
),
    -- real-estate-assistant
    (
        '254fab4b-85af-4c3b-accf-66be5635ce2c'
    , '91fc8939-2dea-44a1-bd17-a1c8f0fe5dc1'   -- property-view
),
    (
        '254fab4b-85af-4c3b-accf-66be5635ce2c'
    , '5fd96f19-abe1-47e7-8a54-0a707bc3e4a4'   -- property-add
),
    (
        '254fab4b-85af-4c3b-accf-66be5635ce2c'
    , '223664c7-650c-40ac-8581-f40e10064537'   -- property-edit
),
    (
        '254fab4b-85af-4c3b-accf-66be5635ce2c'
    , '4dc0f39a-32f0-43a4-9d90-62fd94f20567'   -- sensitive-view
),
    -- assistant-deputy-minister
    (
        '495900b6-4354-46e1-a070-8e80dc9625e0'
    , '91fc8939-2dea-44a1-bd17-a1c8f0fe5dc1'   -- property-view
),
    (
        '495900b6-4354-46e1-a070-8e80dc9625e0'
    , '5fd96f19-abe1-47e7-8a54-0a707bc3e4a4'   -- property-add
),
    (
        '495900b6-4354-46e1-a070-8e80dc9625e0'
    , '223664c7-650c-40ac-8581-f40e10064537'   -- property-edit
),
    (
        '495900b6-4354-46e1-a070-8e80dc9625e0'
    , 'd11ce982-f22b-4cd2-87d4-87b8f7f9a3c8'   -- dispose-approve
),
    (
        '495900b6-4354-46e1-a070-8e80dc9625e0'
    , '4dc0f39a-32f0-43a4-9d90-62fd94f20567'   -- sensitive-view
),
    -- executive-director
    (
        'a961f8c6-c226-4e10-a9a6-a058f6db0458'
    , '91fc8939-2dea-44a1-bd17-a1c8f0fe5dc1'   -- property-view
),
    (
        'a961f8c6-c226-4e10-a9a6-a058f6db0458'
    , '5fd96f19-abe1-47e7-8a54-0a707bc3e4a4'   -- property-add
),
    (
        'a961f8c6-c226-4e10-a9a6-a058f6db0458'
    , '223664c7-650c-40ac-8581-f40e10064537'   -- property-edit
),
    (
        'a961f8c6-c226-4e10-a9a6-a058f6db0458'
    , 'd11ce982-f22b-4cd2-87d4-87b8f7f9a3c8'   -- dispose-approve
),
    (
        'a961f8c6-c226-4e10-a9a6-a058f6db0458'
    , '4dc0f39a-32f0-43a4-9d90-62fd94f20567'   -- sensitive-view
)
