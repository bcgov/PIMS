DELETE FROM dbo.[UserRoles] where [RoleId] = '5c6cea5b-9b7c-47e8-852c-693e90ed815e';
DELETE FROM dbo.[RoleClaims] where [RoleId] = '5c6cea5b-9b7c-47e8-852c-693e90ed815e';
DELETE FROM dbo.[RoleClaims] where [ClaimId] = '81ded21c-ed32-4694-8f33-79ef17833f2b';
DELETE FROM dbo.[Roles] where [Id] = '5c6cea5b-9b7c-47e8-852c-693e90ed815e';
DELETE FROM dbo.[Claims] where [Id] = '81ded21c-ed32-4694-8f33-79ef17833f2b';
