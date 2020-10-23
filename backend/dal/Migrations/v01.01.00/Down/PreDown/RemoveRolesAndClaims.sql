DELETE FROM dbo.[RoleClaims] where RoleId = 'd416f362-1e6f-4e24-a561-c6bb45a35194';
DELETE FROM dbo.[UserRoles] where RoleId = 'd416f362-1e6f-4e24-a561-c6bb45a35194';
DELETE FROM dbo.[Roles] where Id = 'd416f362-1e6f-4e24-a561-c6bb45a35194';
DELETE FROM dbo.[Claims] where Id in ('0fbd370d-6cde-41e7-9039-f05ae60d75da', 'e13d1c7d-f350-4aee-808e-c9603c29479b');