PRINT 'Adding Tasks'

SET IDENTITY_INSERT dbo.[Tasks] ON

INSERT INTO dbo.[Tasks] (
    [Id]
    , [Name]
    , [TaskType]
    , [IsDisabled]
    , [Description]
    , [IsOptional]
    , [SortOrder]
) VALUES (
    1
    , 'Update Financials'
    , 1
    , 0
    , 'Update property financials for the current fiscal year (Estimated, NetBook, Assessed).'
    , 0
    , 1
), (
    2
    , 'Email Surplus Declaration'
    , 1
    , 0
    , 'Email Surplus Declaration document to Live-Link.'
    , 0
    , 2
), (
    3
    , 'Email Readiness Checklist'
    , 1
    , 0
    , 'Email Readiness Checklist document to Live-Link.'
    , 0
    , 3
), (
    4
    , 'Email Triple Bottom Line'
    , 1
    , 0
    , 'Email Triple Bottom Line document to Live-Link.'
    , 0
    , 4
), (
    5
    , 'Get Owning Agency Approval'
    , 1
    , 0
    , 'Ensure owning agency of property has approved disposal.'
    , 0
    , 5
)

SET IDENTITY_INSERT dbo.[Tasks] OFF
