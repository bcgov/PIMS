PRINT 'Adding Tasks'

SET IDENTITY_INSERT dbo.[Tasks] ON

INSERT INTO dbo.[Tasks] (
    [Id]
    , [Name]
    , [IsDisabled]
    , [Description]
    , [IsOptional]
    , [SortOrder]
) VALUES (
    1
    , 'Surplus Declaration & Readiness Checklist completed and sent'
    , 0
    , 'Surplus Declaration & Readiness Checklist document emailed to SRES.'
    , 0
    , 1
), (
    2
    , 'Triple Bottom Line completed and sent'
    , 0
    , 'Triple Bottom Line document emailed to SRES.'
    , 0
    , 2
), (
    3
    , 'Review completed'
    , 0
    , 'Properties have been reviewed and approved.'
    , 0
    , 0
), (
    4
    , 'Documents received and review completed'
    , 0
    , 'Documents have been received, reviewed and approved.'
    , 0
    , 0
), (
    5
    , 'Appraisal ordered'
    , 0
    , 'An appraisal has been ordered.'
    , 1
    , 1
), (
    6
    , 'Appraisal received'
    , 0
    , 'An appraisal has been recieved.'
    , 1
    , 2
), (
    7
    , 'Appraisal completed'
    , 0
    , 'An appraisal has been reviewed and completed.'
    , 1
    , 3
), (
    8
    , 'Strength of Claim'
    , 0
    , 'First Nation Strength of Claim has been created.'
    , 1
    , 1
), (
    9
    , 'In consultation'
    , 0
    , 'First Nation consulation is in progress.'
    , 1
    , 2
), (
    10
    , 'Agreement received'
    , 0
    , 'First Nation agreement has been received.'
    , 1
    , 3
)

SET IDENTITY_INSERT dbo.[Tasks] OFF
