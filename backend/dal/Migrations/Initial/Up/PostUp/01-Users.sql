PRINT 'Adding Users'

INSERT INTO dbo.[Users] (
    [Id]
    , [Username]
    , [DisplayName]
    , [FirstName]
    , [LastName]
    , [Email]
    , [IsDisabled]
    , [IsSystem]
) VALUES (
    '00000000-0000-0000-0000-000000000000'
    , 'system'
    , 'system'
    , 'system'
    , 'system'
    , 'pims@Pims.gov.bc.ca'
    , 1
    , 1
)
