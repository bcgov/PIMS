PRINT 'Adding Users'

INSERT INTO dbo.[Users] (
    [Id]
    , [DisplayName]
    , [FirstName]
    , [LastName]
    , [Email]
    , [IsDisabled]
) VALUES (
    '00000000-0000-0000-0000-000000000000'
    , 'system'
    , 'system'
    , 'system'
    , 'pims@Pims.gov.bc.ca'
    , 1
)
