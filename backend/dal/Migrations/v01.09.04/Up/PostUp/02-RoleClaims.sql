PRINT 'Remove RoleClaims - Property-Delete'

DELETE FROM dbo.[RoleClaims]
WHERE [RoleId] = 'aad8c03d-892c-4cc3-b992-5b41c4f2392c' -- real-estate-manager
    AND [ClaimId] = '223664c7-650c-40ac-8581-f40e10164537' -- property-delete

DELETE FROM dbo.[RoleClaims]
WHERE [RoleId] = '7a7b2549-ae85-4ad6-a8d3-3a5f8d4f9ca5' -- real-estate-assistant
    AND [ClaimId] = '223664c7-650c-40ac-8581-f40e10164537' -- property-delete
