PRINT N'Update [Users]'

-- Copy the current user Id into the KeycloakUserId.
UPDATE dbo.[Users]
SET [KeycloakUserId] = [Id]
