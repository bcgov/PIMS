INSERT INTO "role" ("Id", "Name", "IsDisabled", "SortOrder", "Description", "IsPublic", "CreatedById")
VALUES  ('00000000-0000-0000-0000-000000000000', 'Administrator', FALSE, 0, 'Administrators can view and edit all properties. They can manage all areas, such as users and agencies.', TRUE, (SELECT "Id" FROM "user" WHERE "Username" = 'system')),
        ('00000000-0000-0000-0000-000000000001', 'General User', FALSE, 0, 'General Users can view and edit properties within their agency.', TRUE, (SELECT "Id" FROM "user" WHERE "Username" = 'system')),
        ('00000000-0000-0000-0000-000000000002', 'Auditor', FALSE, 0, 'Auditors can view all properties, but they have no editing permissions.', TRUE, (SELECT "Id" FROM "user" WHERE "Username" = 'system'));

