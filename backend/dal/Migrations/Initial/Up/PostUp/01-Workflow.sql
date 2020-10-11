PRINT 'Adding Workflows'

SET IDENTITY_INSERT dbo.[Workflows] ON

INSERT INTO dbo.[Workflows] (
    [Id]
    , [Name]
    , [Code]
    , [IsDisabled]
    , [Description]
    , [SortOrder]
) VALUES (
    1
    , 'Submit Surplus Property Process Project'
    , 'SUBMIT-DISPOSAL'
    , 0
    , 'Create a new Surplus Property Process Project to add properties to the Enhanced Referral Program or the Surplus Property List.'
    , 0
), (
    2
    , 'Access Surplus Property Process Project Request'
    , 'ASSESS-DISPOSAL'
    , 0
    , 'Assess a submitted Surplus Property Process Project to determine whether it will be approved or denied.'
    , 1
), (
    3
    , 'Access Enhanced Referral Process Exemption'
    , 'ASSESS-EXEMPTION'
    , 0
    , 'Assess a requested ERP exemption.'
    , 2
), (
    4
    , 'Access Enhanced Referral Process Exemption Project Request'
    , 'ASSESS-EX-DISPOSAL'
    , 0
    , 'Assess a submitted Surplus Property Process Project to determine whether it will be approved or denied.'
    , 3
), (
    5
    , 'Enhanced Referral Program'
    , 'ERP'
    , 0
    , 'Internal marketing for 90 days.'
    , 4
), (
    6
    , 'Surplus Property List'
    , 'SPL'
    , 0
    , 'External marketing.'
    , 5
)

SET IDENTITY_INSERT dbo.[Workflows] OFF
