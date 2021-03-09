PRINT 'Add RoleClaims - Property-Delete'

INSERT INTO dbo.[RoleClaims]
    (
    [RoleId]
    , [ClaimId]
    )
VALUES
    -- real-estate-manager
(
    'aad8c03d-892c-4cc3-b992-5b41c4f2392c'
    , '223664c7-650c-40ac-8581-f40e10164537'   -- property-delete
),
    -- real-estate-assistant
(
    '7a7b2549-ae85-4ad6-a8d3-3a5f8d4f9ca5'
    , '223664c7-650c-40ac-8581-f40e10164537'   -- property-delete
)
